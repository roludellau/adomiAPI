import { Request, ResponseToolkit } from "hapi";

const db = require('../models/index')
import argon2 from 'argon2';
import boom from '@hapi/boom'
import { Error, ValidationError, ValidationErrorItem } from 'sequelize' 
const Sequelize = require('Sequelize')
const Op = Sequelize.Op

import { UserAttributes } from '../models/user'
const sequelize = db.default.sequelize
const userModel = db.default.User
const agencyModel = db.default.Agency
const missionModel = db.default.Mission
const appointmentModel = db.default.Appointment

export default class CustomerController {

    static getAllCustomers = async () => {
        try {await sequelize.authenticate()}
        catch {return boom.serverUnavailable('Le serveur de bdd ne répond pas')}

        try{
          const customers = await userModel.findAll({attributes: ['first_name'], where:{id_role: 1}})
            return customers;
        }
        catch(err){
            console.log(err);
            throw boom.badImplementation()
        }
        
    }
 
    static customerSearch = async (req: Request, h: ResponseToolkit) => {
        const query = req.query?.q
        const page = parseInt(req.query?.page as string)
        if (!query){
            throw boom.badRequest('Vous devez indiquer un texte à rechercher en query, avec "q=votreQuery"')
        }
        if (!page || isNaN(page) || page < 1){
            throw boom.badRequest('Vous devez indiquer le numéro de page en query (+ que 0)')
        }

        console.log("page =", page)

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
                const results = await userModel.findAll({
                    attributes: ['id', 'first_name', 'last_name', 'email', 'user_name', 'phone', 'street_name', 
                                 'street_number', 'post_code', 'city', 'id_agency'], 
                    where:{
                        id_role: 1,
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


    static getOneCustomer = async (request: Request, h: ResponseToolkit) => {
        let idKey = request.params.id;

            const customer = await userModel.findOne({
                attributes: [
                    'first_name', 
                    'last_name', 
                    'email', 
                    'phone', 
                    'street_name', 
                    'post_code', 
                    'city'], 
                where:{
                    id: idKey,
                },
                include: [
                    {
                        association: 'role', 
                        attributes: ['label']
                    },
                    {
                        association: 'agency',
                        attributes: ['name', 'adress']
                    }
                
                ]})
                .catch((err: Error) => {
                    console.log(err)
                    boom.serverUnavailable('Erreur inconnue')
                })

            return customer;
    }


    static createCustomer = async (request: Request, h: ResponseToolkit) => {
        if (typeof request.payload !== 'object'){
            return boom.badData('Le corps de la requête doit être un objet JSON')
        }

        let info = request.payload as any

        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&µ£\/\\~|\-])[\wÀ-ÖØ-öø-ÿ@$!%*#?&µ£~|\-]{8,255}$/)
        if (!info.password) return boom.badData('Le champs password n\'a pas été fourni')
        if (!(info.password as string).match(regex)){
            return boom.badData('Votre mot de passe doit contenir une lettre, un chiffre, un caractère spécial, et faire au moins 8 caractères')
        }

        const previousUsername = await userModel.findOne({where: {user_name: info.user_name || null}})
        const previousEmail = await userModel.findOne({where: {email: info.email || null}})

        if (previousUsername) return boom.conflict('Un utilisateur possède déjà le même nom d\'utilisateur')
        if (previousEmail) return boom.conflict('Un utilisateur possède déjà le même email')


        try {
            info.password = await argon2.hash(info.password as string);
            info.id_role = '1';
            const createdUser = await userModel.create(info)
            delete createdUser.dataValues.password
            return createdUser
        }
        catch (error: any) {
            if (error?.errors){
                type ApiError = { message: string, field: string|null }
                let errorList:ApiError[] = []
                error.errors.map((item:ValidationErrorItem) => errorList.push({ field: item.path, message: item.message }))
                return h.response({
                    statusCode: 422,
                    statusName: "Unprocessable Entity",
                    errors: errorList
                })
                .code(422)
            }
            else return boom.badImplementation()
        }
        
    }


    static updateCustomer = async (request: Request, h: ResponseToolkit) =>{

        try {
            let customer = await userModel.findOne({attributes:['id','first_name', 'last_name', 'email', 'user_name', 'phone', 'street_name', 'street_number', 'post_code', 'city', 'idAgency'], where:{id: request.params.id}});
            if(customer){
                const updatedCustomer = await customer.update({
                    first_name: request.query.first_name,
                    last_name: request.query.last_name,
                    email: request.query.email,
                    user_name: request.query.user_name,
                    phone: request.query.phone,
                    street_name: request.query.street_name,
                    street_number: request.query.street_number,
                    post_code: request.query.poste_code,
                    city: request.query.city,
                    idAgency: request.query.idAgency
                })

                return updatedCustomer
            }
        }
        catch(err){
            console.log(err);
            boom.serverUnavailable('Erreur inconnue')
        }
    }

    static deleteCustomer = async (request:Request, h: ResponseToolkit)=>{

            let customer = await userModel.findOne({
                attributes:['id'], 
                where:{
                    id: request.params.id
                }
            })
            .catch((err:Error) => {
                console.log(err)
                boom.serverUnavailable('Erreur inconnue')
            })

            if (!customer){
                return boom.notFound('L\'utilisateur n\'a pas été trouvé')
            }

            await userModel.destroy({
                where:{id: customer.dataValues.id}
            })

            return "customer supprimé"
        
    }

    static getCustomerAgency = async (request: Request, h:ResponseToolkit)=>{

        try{
            let customer = await userModel.findOne({attributes:['idAgency'], where:{id: request.params.id}})
            let agency = await agencyModel.findOne({attributes:['name', 'adress'], where:{id: customer.dataValues.idAgency}})
            return agency
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    static getCustomerCarers= async(request: Request, h: ResponseToolkit) => {

        try{
            let carer = await missionModel.findAll({attributes:['idCarer'], 
                where:{idClient: request.params.id},
                group:['idCarer'],
                include:{
                    association: 'carer',
                    attributes:['first_name', 'last_name', 'phone'],
                }})

            return carer
        }
        catch(err){
            console.log(err);
            throw err
        }

    }

    static getCustomerAppointments = async (request: Request, h: ResponseToolkit) =>{

        try {

            let appointments = await appointmentModel.findAll({
                attributes:['date', 'startHour', 'endHour'],
                include:[
                    {
                        association: 'mission',
                        attributes:['idCarer', 'idClient'],
                        where:{idClient : request.params.id}
                    }
                ]
            })

            return appointments

        }
        catch(err){
            console.log(err);
            throw err
        }
    }

    static getCustomerReferent = async(request: Request, h: ResponseToolkit)=>{

        try{
            let customer =  await sequelize.query(
                "SELECT `User`.`id` AS `client id`, `User`.`first_name` AS `client name`, `referent`.`id` AS `referent id`, `referent`.`first_name` AS `referent name` FROM `Users` AS `User` LEFT OUTER JOIN ( `client_has_referent` INNER JOIN `Users` AS `referent` ON `referent`.`id` = `client_has_referent`.`idEmployee`) ON `User`.`id` = `client_has_referent`.`idClient` WHERE `User`.`id` = '"+ request.params.id +"'",
                { 
                    type: sequelize.QueryTypes.SELECT
                } 
            )            
            return (customer);
        }
        catch(err){
            console.log(err);
            throw err;
        }
        
    }

}