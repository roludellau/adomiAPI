import { Request, ResponseToolkit } from "hapi";

const db = require('../models/index')
import argon2 from 'argon2';
import boom from '@hapi/boom'
const sequelize = db.default.sequelize
const userModel = db.default.User
const agencyModel = db.default.Agency
const customerModel = db.default.User
const missionModel = db.default.Mission
const appointmentModel = db.default.Appointment

export default class CustomerController{

    static getAllCustomers = async () => {

        try{
          const customers = await customerModel.findAll({attributes: ['firstname'], where:{idRole: 2}})
            return customers;
        }
        catch(err){
            console.log(err);
        }
        
    }


    static getOneCustomer = async (request: Request, h: ResponseToolkit)=>{

        let idKey = request.params.id;

            const customer = await customerModel.findOne({
                attributes: [
                    'firstname', 
                    'lastname', 
                    'email', 
                    'phone', 
                    'street_name', 
                    'post_code', 
                    'city'], 
                where:{
                    id: idKey
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


    static createCustomer = async (request: Request, h: ResponseToolkit)=>{

        try {
            const userpassword = await argon2.hash(request.query.password as string);

            const test =  await userModel.create({
                firstName: request.query.firstName,
                lastName: request.query.lastName,
                email: request.query.email,
                password: userpassword,
                userName: request.query.userName,
                phone: request.query.phone,
                street_name: request.query.street_name,
                street_number: request.query.street_number,
                post_code: request.query.poste_code,
                city: request.query.city,
                idRole: request.query.idRole,
                idAgency: request.query.idAgency
            });

            return test
        }
        catch(err){
            console.log(err);
            boom.serverUnavailable('Erreur inconnue')
        }
        
    }

    static updateCustomer = async (request: Request, h: ResponseToolkit) =>{

        try {
            let customer = await customerModel.findOne({attributes:['id','firstName', 'lastname', 'email', 'userName', 'phone', 'street_name', 'street_number', 'post_code', 'city', 'idAgency'], where:{id: request.params.id}});
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

            let customer = await customerModel.findOne({
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

            await customerModel.destroy({
                where:{id: customer.dataValues.id}
            })

            return "customer supprimé"
        
    }

    static getCustomerAgency = async (request: Request, h:ResponseToolkit)=>{

        try{
            let customer = await customerModel.findOne({attributes:['idAgency'], where:{id: request.params.id}})
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