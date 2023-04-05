import { Request, ResponseToolkit } from "hapi";

const db = require('../models/index')
import argon2 from 'argon2';
import boom from '@hapi/boom'
import { Error, ValidationError, ValidationErrorItem} from 'sequelize' 
import { UserAttributes } from '../models/user'
const sequelize = db.default.sequelize
const userModel = db.default.User
const agencyModel = db.default.Agency
const missionModel = db.default.Mission
const appointmentModel = db.default.Appointment

export default class CustomerController{

    static getAllCustomers = async () => {

        try{
          const customers = await userModel.findAll({attributes: ['firstname'], where:{idRole: 2}})
            return customers;
        }
        catch(err){
            console.log(err);
        }
        
    }


    static getOneCustomer = async (request: Request, h: ResponseToolkit) => {

        let idKey = request.params.id;

            const customer = await userModel.findOne({
                attributes: [
                    'firstname', 
                    'lastname', 
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
                .catch(async (err: Error) => {
                    console.log(err)
                    boom.serverUnavailable('Erreur inconnue')
                })

            return customer;
    }


    static createCustomer = async (request: Request, h: ResponseToolkit) => {
        let info = request.query;
        
        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&µ£\/\\~|\-])[\wÀ-ÖØ-öø-ÿ@$!%*#?&µ£~|\-]{8,255}$/)
        if (!info.password) return boom.badData('Le champs password n\'a pas été fourni')
        if (!(info.password as string).match(regex)){
            return boom.badData('Votre mot de passe doit contenir une lettre, un chiffre, un caractère spécial, et faire au moins 8 caractères')
        }

        try {
            info.password = await argon2.hash(info.password as string);
            info.id_role = '1';
            const createdUser = await userModel.create(info);
            delete createdUser.dataValues.password
            return createdUser
        }
        catch (error: any) {
            if (error?.errors){
                type ApiError = { message: string, field: string|null }
                let errorArray:ApiError[] = []
                error.errors.map((item:ValidationErrorItem) => errorArray.push({ field: item.path, message: item.message }))
                return {
                    errors: errorArray
                }
            }
            else return boom.badImplementation()
        }
        
    }

    static updateCustomer = async (request: Request, h: ResponseToolkit) =>{

        try {
            let customer = await userModel.findOne({attributes:['id','firstName', 'lastname', 'email', 'userName', 'phone', 'street_name', 'street_number', 'post_code', 'city', 'idAgency'], where:{id: request.params.id}});
            if(customer){
                const updatedCustomer = await customer.update({
                    firstName: request.query.firstName,
                    lastName: request.query.lastName,
                    email: request.query.email,
                    userName: request.query.userName,
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
                include:{
                    association: 'carer',
                    attributes:['firstname', 'lastname', 'phone'],
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
                "SELECT `User`.`id` AS `client id`, `User`.`firstname` AS `client name`, `referent`.`id` AS `referent id`, `referent`.`firstname` AS `referent name` FROM `Users` AS `User` LEFT OUTER JOIN ( `client_has_referent` INNER JOIN `Users` AS `referent` ON `referent`.`id` = `client_has_referent`.`idEmployee`) ON `User`.`id` = `client_has_referent`.`idClient` WHERE `User`.`id` = '"+ request.params.id +"'",
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