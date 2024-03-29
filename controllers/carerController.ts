import { Request, ResponseToolkit } from "hapi";
import argon2 from 'argon2';
import boom from '@hapi/boom'
import { UserAttributes } from '../models/user'
import Sequelize, { Error, ValidationError, ValidationErrorItem} from "sequelize";
import ValidationUtils from "./validationUtils";
import validator from "validator";
import moment from "moment";
import { type AppointmentInterface} from '../models/appointment'
import { type MissionInterface} from '../models/mission'
import {type availabilitiesAttributes } from '../models/availability'

const { Op } = require("sequelize");

const db = require('../models/index')
const sequelize = db.default.sequelize
const User = db.default.User
const Availability = db.default.Availability
const Mission = db.default.Mission
const Appointment = db.default.Appointment


export default class CarerController {
   
    static getAllCarers = async () => {
        try {
            const customers = await User.findAll({attributes: ['id','first_name', 'last_name', 'email', 'phone', 'street_name', 'street_number', 'post_code', 'city'], where: {id_role: 3}})
            return customers;
        }
        catch(err){
            console.log(err);
            throw boom.badImplementation()
        }
    }

    static createCarer = async (req: Request, h: ResponseToolkit) => {
        const valid = new ValidationUtils()
        if (!req.payload){
            return boom.badRequest("Veuillez fournir le corps de la requête")
        }
        const payload = { ... ( req.payload as typeof User) } 
        if (!payload.password) {
            return boom.badData('Le champs password n\'a pas été fourni')
        }

        const [ok, err] = valid.validatePassword(payload.password)
        if (!ok) {
            return err
        }

        try {
            const previous = await User.findOne({ 
                where: {
                    [Op.or]: [
                        { user_name: ( payload.user_name ?? '') },
                        { email: ( payload.email ?? '') } 
                    ]   
                }   
            })
            if (previous) return boom.conflict('Un utilisateur avec ce nom ou cet email existe déjà')

            payload.id_role = '3' //toujours
            payload.password = await argon2.hash(payload.password)
            valid.escapeInputs(payload) // par référence

            let newCarer = await User.create(payload)

            return h.response({ ...newCarer.dataValues, password: '' }).code(201)  
        }
        catch (err: any) {
            //console.log(err)
            return valid.getSequelizeErrors(err, h)
        }
    }


    static getCarerById = async (req: Request, h: ResponseToolkit) => {
            return (
                await User.findByPk(req.params.id)
                .then((result: UserAttributes|null) => result )
                .catch((err: Error) => boom.boomify(err))
            )
    }

   
    static updateCarer = async (req: Request, h: ResponseToolkit) => {
            const valid = new ValidationUtils()
            const id = req.params.id
            if (!id || isNaN(parseInt(id))) {
                return boom.badRequest("Veuillez fournir un entier positif comme id, dans la route")
            }
            const payload = req.payload as typeof User
            if (!payload) {
                return boom.badRequest("Veuillez fournir le corps de la requête")
            }
            if (payload.password){
                const [ok, err] = valid.validatePassword(payload.password)
                if (!ok) {
                    return err
                }
            }

            payload.id_role = '3'
            if (payload.password) payload.password = await argon2.hash(payload.password)
            valid.escapeInputs(payload) // passed by reference
            
            try {
                const rowsaffected = await User.update(payload, { where: { id: id, id_role: 3 } })
                if (rowsaffected == 0) {
                    return h.response().code(204)
                }
                const updatedCarer = await User.findByPk(id)
                return h.response({updated_carer: updatedCarer}).code(200)
            }
            catch (err: any) {
                return valid.getSequelizeErrors(err, h)
            }

        }

   


   static deleteCarer = async (req: Request, h: ResponseToolkit) => {
        const response = await User.destroy({where: {id: req.params.id}})
                            .then((rowsAffected:number) => rowsAffected)
                            .catch((err:Error) => { 
                                boom.boomify(err)
                            })
        return response

   } 


   static addAvailability = async (req: Request, h: ResponseToolkit) => {
        let payload = req.payload as availabilitiesAttributes
        if (!payload || !payload.week_day || !payload.start_hour || !payload.end_hour) {
            return boom.badRequest("Veuillez fournir un payload avec les champs 'week_day', 'start_hour', 'end_hour'.")
        }

        const valid = new ValidationUtils()

        let existing = await Availability.findOne({where:payload}).catch((err: ValidationError) =>  valid.no_handler_get_sequelize_error(err))
        if (Array.isArray(existing)){
            return h.response({
                statusCode: 422,
                statusName: "Unprocessable Entity",
                errors: existing
            })
            .code(422)
        }

    // Check si l'auxiliaire est lié à cette dispo
        if (existing) {
            const isLinked = await sequelize.query(
                "SELECT `idCarer`"
                + " FROM `carer_has_availabilities`"
                + " WHERE (idAvailability = :idExisting) AND (idCarer = :idCarer)",
                {
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: { 
                        idExisting : existing.id, 
                        idCarer: req.params.id
                    },
                }
            ).then((result:any[]) => result[0])
             .catch(() => boom.serverUnavailable('Erreur à "isLinked" dans "addAvailability"'))
            
            if (isLinked) {
                console.log(isLinked)
                return boom.conflict('L\'auxiliaire a déjà ce créneau associé à son compte')
            }

        //S'il n'est pas lié à cette dispo
            const addLink = await sequelize.query (
                "INSERT INTO `carer_has_availabilities` (idCarer, idAvailability)"
                + " VALUES (:idCarer, :idAvailability)",
                {
                    replacements: {
                        idCarer : req.params.id,
                        idAvailability : existing.id
                    }
                }
            ).then(() => existing) //Retourne la dispo nouvellement liée
             .catch(() => boom.serverUnavailable('Erreur à addLink') )
            return addLink
        }


    //Crée la dispo et lie le carer
        const t = await sequelize.transaction()
        try {
            const newAvailability = await Availability.create(payload)
            await sequelize.query(
                "INSERT INTO `carer_has_availabilities` (idCarer, idAvailability)"
                + " VALUES (:idCarer, :idAvailability)",
                {
                    replacements: {
                        idCarer : req.params.id,
                        idAvailability : newAvailability.id
                    }
                }
            )
            return newAvailability
        }
        catch (err: any) {
            await t.rollback()
            return valid.getSequelizeErrors(err, h)
        }
   }

   static getAvailabilities = async (req: Request, h: ResponseToolkit) => {
        const result = await sequelize.query(
            "SELECT `availabilities`.`week_day`, `availabilities`.`start_hour`, `availabilities`.`end_hour`"
            + " FROM `users`"
            + " JOIN `carer_has_availabilities` ON `users`.`id` = `carer_has_availabilities`.`idCarer`"
            + " JOIN `availabilities` ON `carer_has_availabilities`.`idAvailability` = `availabilities`.`id`"
            + " WHERE `users`.`id` = :carerId",
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: {carerId: req.params.id}
            }
        )
        .then((result:PromiseFulfilledResult<any>) => result)
        .catch((err:Error) => {boom.serverUnavailable(); console.log(err)})
        return result
    }
   

    static deleteAvailability = async (req: Request, h: ResponseToolkit) => {
        return await Availability.destroy({
            where: {id: req.params.id}
        })
        .then((res: any) => { return {rowsAffected: res} })
        .catch((err: Error) => {
            console.log(err);
            return boom.internal('Désolé, veuillez réessayer plus tard.')
        })
    }


    static getCarerCustomers = async (req: Request, h: ResponseToolkit) => {
        return await Mission.findAll({attributes:['idClient'], 
            where:{idCarer: req.params.id},
            include:{
                association: 'client',
                attributes:['first_name', 'last_name', 'phone'],
            }
        })
        .then((customers:PromiseFulfilledResult<any>) => customers)
        .catch((err:Error) => {
            console.log(err)
            return boom.serverUnavailable()
        })
        //Finir: éviter de récupérer plusieurs fois le même client
    }

    static getLatestAppointments = async (req: Request, h: ResponseToolkit) => {
        
        const date = new Date();

        let dd = date.getDate();
        let dd2 = dd+1;
        let mm = date.getMonth()+1;
        let yy = date.getFullYear();

        const day = (dd<10)? "0" + dd : dd;
        const day2 = (dd2<10)? "0" + dd2 : dd2;
        const month = (mm<10)? "0" + mm : mm;
        
        const today = moment(yy + "-" + month + "-" + day, "YYYY-MM-DD").format("YYYY-MM-DD");
        const tomorrow = moment(yy + "-" + month + "-" + day2, "YYYY-MM-DD").format("YYYY-MM-DD");

        return await Appointment.findAll(
            {
                attributes: ['id', 'idMission', 'date', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city'],
                where: [
                    {idCarer: req.params.id},
                    {date: [today, tomorrow]}
                ],
                include: {
                    association: 'mission',
                    attributes: ['idClient', 'idRecurence'],
                    include:{
                        association:'client',
                        attributes: ['first_name', 'last_name'],
                    }
                },
                order: [
                        ['date', 'ASC'],
                        ['startHour', 'ASC']
                ],
                limit: 2
            }
        ).then((res: typeof Appointment[]) => res)
         .catch((err: Error) => { console.log(err); return err })
    }


    static getAppointments = async (req: Request, h: ResponseToolkit) => {
        let carerId = req.params.id
        
        const sixMonthAgo = () => {
            let d = new Date()
            d.setMonth(d.getMonth() - 6)
            return d.toISOString()
        }

        const camelToSnake: {[key:string]: string} = {
            "streetName": "street_name",
            "streetNumber": "street_number",
            "postCode": "post_code",    
        }

        let appointments: AppointmentInterface[] = await Appointment.findAll (
            {
                attributes: ['id', 'idMission', 'date', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city'],
                where: [{ idCarer: carerId, date: {[Op.gt]: sixMonthAgo()} }], 
                include: {
                    association:'mission',
                    attributes: ['id', 'startDate', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city', 'validated', 'idEmployee'],
                    include: {
                        association:'client',
                        attributes: ['first_name', 'last_name', 'street_name', 'street_number', 'post_code', 'city'],
                    }
                },
                order: [
                    ['date', 'DESC'],
                    ['startHour', 'ASC']
                ]
            }
        )

        const missions = await Mission.findAll ({where: {idCarer: req.params.id}, /* and {validated: true}*/})

        for (const mission of missions) {
            const appts = await Appointment.findAll (
                {
                    attributes: ['id', 'idMission', 'date', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city'],
                    where: [{ idMission: mission.id, date: {[Op.gt]: sixMonthAgo()} }], 
                    include: {
                        association:'mission',
                        attributes: ['id', 'startDate', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city', 'validated', 'idEmployee'],
                        include: {
                            association:'client',
                            attributes: ['first_name', 'last_name', 'street_name', 'street_number', 'post_code', 'city'],
                        }
                    },
                    order: [
                        ['date', 'DESC'],
                        ['startHour', 'ASC']
                    ]
                }
            )
            //console.log("ONE MISSIONS APPTS /", appts)
            appointments = [...appointments, ...appts]
        }

        appointments.sort((a, b) => a.date > b.date ? -1 : +1)

        try {
            appointments.forEach ( (a) => {
                let mission = a.mission as any
                let client = mission.client as any
                a = a.dataValues as AppointmentInterface

                let isThereNullField = false
                for (const field in a) {
                    if (a[field] === null) isThereNullField = true
                    //console.log(field + " " + a[field])
                }
                if (!isThereNullField) return
                
                isThereNullField = false
                for (const field in a) {
                    if (a[field] === null) a[field] = mission[field]
                    if (a[field] === null) isThereNullField = true
                }
                if (!isThereNullField) return

                for (const field in a) {
                    if (a[field] === null) a[field] = client[camelToSnake[field] || field]
                }
            })

            return appointments
        }
        catch(eur) {
            console.log(eur)
            return boom.badImplementation()
        }
    }



    static carerSearch = async (req: Request, h: ResponseToolkit) => {
        const query = req.query?.q
        const page = parseInt(req.query?.page as string)
        if (!query){
            throw boom.badRequest('Vous devez indiquer un texte à rechercher en query, avec "q=votreQuery"')
        }
        if (!page || isNaN(page) || page < 1){
            throw boom.badRequest('Vous devez indiquer le numéro de page en query (+ que 0)')
        }

        let splitQuery: string[] = (query as string).split(" ")
        // Inverting first and second words to get results based on lastname first
        const [two, one] = [splitQuery[1], splitQuery[0]]
        splitQuery[0] = two
        splitQuery[1] = one

        let sqlLimit = 50
        let sqlOffset = Math.floor(50 * (page - 1))

        try {await sequelize.authenticate()}
        catch {return boom.serverUnavailable('Le serveur de bdd ne répond pas')}

        try{
            let customers: UserAttributes[] = []

            for (const queryChunk of splitQuery) {
                const results = await User.findAll({
                    attributes: ['id', 'first_name', 'last_name', 'email', 'user_name', 'phone', 'street_name', 
                                 'street_number', 'post_code', 'city', 'id_agency'], 
                    where:{
                        id_role: 3,
                        [Op.or]: [
                            { first_name: {[Op.like]: '%'+queryChunk+'%'} },
                            { last_name: {[Op.like]: '%'+queryChunk+'%'} },
                            { user_name: {[Op.like]: '%'+queryChunk+'%'} },
                            { email: {[Op.like]: '%'+queryChunk+'%'} },
                        ]
                    },
                    offset: sqlOffset,
                    limit : sqlLimit,
                })
                loop1:
                for (let res of results){
                    const email = res.email
                    loop2:
                    for (let cust of customers) {
                        if (cust.email == email) {
                            continue loop1
                        }
                    }
                    customers.push(res)
                }
            }

            return customers;
        }
        catch(err){
            console.log(err)
            throw boom.badImplementation()
        }
        
    }

}