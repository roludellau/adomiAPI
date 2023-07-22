import { Request, ResponseToolkit } from "hapi";
import argon2 from 'argon2';
import boom from '@hapi/boom'
import { UserAttributes } from '../models/user'
import Sequelize, { Error } from "sequelize";
import moment from "moment";
const Op = Sequelize.Op

const db = require('../models/index')
const sequelize = db.default.sequelize
const User = db.default.User
const Availability = db.default.Availability
const Mission = db.default.Mission
const Appointment = db.default.Appointment

export default class CarerController {

   static createCarer = async (req: Request, h: ResponseToolkit) => {
        if (await User.findOne({where:{last_name: req.query.last_name, first_name: req.query.first_name}})){
            return boom.conflict('Un utilisateur de ce nom existe déjà')
        }

        const t = await sequelize.transaction().then((t:PromiseFulfilledResult<any>) => t).catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }

        let payload: typeof User = {...req.query}
        payload.password = await argon2.hash(payload.password)
        payload.idRole = '3' //toujours

        let newCarer = await User.create(payload)
            .then((res: UserAttributes) => { return { ...res, password: '' } }) //pourpakivoi
            .catch((err:Error) => {
                t.rollback()
                return boom.badData('Les données fournies sont probablement mal formatées.')
            })
        
        return newCarer
   }


   static getCarerById = async (req: Request, h: ResponseToolkit) => {
        return (
            await User.findByPk(req.params.id)
            .then((result: UserAttributes|null) => result )
            .catch((err: Error) => boom.boomify(err))
        )
   }

   
   static updateCarer = async (req: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction().then((t:PromiseFulfilledResult<any>) => t).catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }
        const payload = req.query
        const response = await User.update(payload, {where: {id:req.params.id}})
              .then((rowsAffected:number) => rowsAffected)
              .catch(() => { 
                  t.rollback() 
                  return boom.badData('Les données fournies sont probablement mal formatées.')
              })
        return response
    }

   


   static deleteCarer = async (req: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction().then((t:PromiseFulfilledResult<any>) => t).catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }
        const response = await User.destroy({where: {id: req.params.id}})
                            .then((rowsAffected:number) => rowsAffected)
                            .catch((err:Error) => { 
                                t.rollback() 
                                boom.boomify(err)
                            })
        return response

   } 


   static addAvailability = async (req: Request, h: ResponseToolkit) => {
        let payload = req.query
        let existing = await Availability.findOne({where:payload})
                                .then((res: typeof Availability) => res)
                                .catch((err:Error) => boom.boomify(err))


    //Si la dispo existe
        if (existing){
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
             .catch(() => boom.serverUnavailable('Erreur à isLinked'))
            
        //Si l'auxiliaire est lié à cette dispo
            if (isLinked){
                console.log(isLinked)
                return boom.conflict('L\'auxiliaire a déjà ce créneau associé à son compte')
            }

        //S'il n'est pas lié à cette dispo
            const addLink = await sequelize.query(
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
        catch (err){
            console.log(err)
            t.rollback()
            return boom.badData('Les données fournies sont probablement mal formatées.')
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
        const t = await sequelize.transaction().then((t:any) => t).catch((err: Error) => boom.serverUnavailable('Allume ton WAMP, banane.'))
        return await Availability.destroy({
            where: {id: req.params.id}
        })
        .then((res: any) => { return {rowsAffected: res} })
        .catch((err: Error) => {
            console.log(err);
            t.rollback()
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
        console.log(today)
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
        const appointments:any[] = await Appointment.findAll(
            {
                attributes: ['id', 'idMission', 'date', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city'],
                where: {idCarer: req.params.id},
                include: {
                    association: 'mission',
                    attributes: ['idClient', 'idRecurence'],
                    include:{
                        association:'client',
                        attributes: ['first_name', 'last_name'],
                    }
                },
                order: [
                    ['date', 'DESC'],
                    ['startHour', 'ASC']
                ]
            }
        ).then((res: typeof Appointment[]) => res)
         .catch((err: Error) => { console.log(err); return err })

        //appt : appointment
        //Pour chaque rdv: retire les champs nulls, les note, va les chercher dans la table d'après 
        const completeInfo = await Promise.all(
            appointments.map(async (appt) => {
                //Verif des champs d'appointments
                let nullInfo = []
                let info = appt.dataValues
                for (const prop in info){
                    if (info[prop] == null){
                        nullInfo.push(prop)
                        delete info[prop]
                    }
                }
                if (nullInfo.length == 0){
                    return new Promise((resolveFunc) => {
                        resolveFunc(appt)
                    })
                }

                //Fetch mission
                const infoFromMission = await Mission.findByPk(info.idMission, { attributes: nullInfo })
                    .then((info: typeof Mission) => info)
                    .catch((err:Error) => console.log(err))
                //Verif des champs de missions
                info = {... info, ... infoFromMission.dataValues}
                nullInfo = []
                for (const prop in info){
                    if (info[prop] == null){
                        nullInfo.push(prop)
                        delete info[prop]
                    }
                }
                if (nullInfo.length == 0){
                    appt.dataValues = {... appt.dataValues, ... info}
                    return new Promise((resolveFunc) => {
                        resolveFunc(appt)
                    })
                }

                //Fetch customer
                const infoFromCustomer = await User.findByPk(info.idClient, { attributes: nullInfo })
                .then((info: typeof User) => info)
                .catch((err:Error) => console.log(err))
                appt.dataValues = {... appt.dataValues, ... info, ... infoFromCustomer.dataValues}

                return new Promise((resolveFunc) => {
                    resolveFunc(appt)
                })
            })
        )
        
        
       return completeInfo
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
                    attributes: ['first_name', 'last_name', 'email', 'user_name', 'phone', 'street_name', 
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