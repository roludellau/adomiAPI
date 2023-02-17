import { Request, ResponseToolkit } from "hapi";

const db = require('../models/index')
import argon2 from 'argon2';
const sequelize = db.default.sequelize
const userModel = db.default.User
const agencyModel = db.default.Agency
const customerModel = db.default.User
const missionModel = db.default.Mission
const appointmentModel = db.default.Appointment

export default class CustomerController{

    static getAllCustomers = async ()=>{

        try{

          const customers = await customerModel.findAll({attributes: ['firstname'], where:{idRole: 1}})
        
            return customers;

        }
        catch(err){

            console.log(err);
            
        }
        
    }


    static getOneCustomer = async (request: Request, h: ResponseToolkit)=>{

        let idKey = request.params.id;

        try{

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
                
                ]});

            return customer;
        }
        catch(err){

            console.log(err);
            
        }
    }

    static createCustomer = async (request: Request, h: ResponseToolkit)=>{

        const t = await sequelize.transaction();

        try{
            const userpassword = await argon2.hash(request.query.password[0]);

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
            throw err;
        }
        
    }

    static updateCustomer = async (request: Request, h: ResponseToolkit) =>{

        try{
            
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
    
                console.log(updatedCustomer);
    
                return updatedCustomer
                // return customer

            }        

        }
        catch(err){

            console.log(err);
            throw err
            
        }

    }

    static deleteCustomer = async (request:Request, h: ResponseToolkit)=>{

        try{

            let customer = await customerModel.findOne({
                attributes:['id'], 
                where:{
                    id: request.params.id
                }
            })

            try{
                
                await customerModel.destroy({
                    where:{id: customer.dataValues.id}
                })

                return "customer supprimé"

            }
            catch(err){

                console.log(err);
                throw err
                
            }
        }

        catch(err){
            console.log(err);
            throw err
            
        }
        
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

    static getCustomerCarers= async(request: Request, h: ResponseToolkit) =>{

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

        try{

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
            let customer =  await sequelize.query(" SELECT DISTINCT `User`.`id` AS `client id`, `User`.`firstname` AS `client name`, `referent`.`id` AS `referent id`, `referent`.`firstname` AS `referent name` FROM `Users` AS `User` LEFT OUTER JOIN ( `client_has_referent` AS `referent->client_has_referent` INNER JOIN `Users` AS `referent` ON `referent`.`id` = `referent->client_has_referent`.`idEmployee`) ON `User`.`id` = `referent->client_has_referent`.`idClient` WHERE `User`.`id` = '1' ", { type: sequelize.QueryTypes.SELECT} )

            // console.log(customer)
            
            return (customer);
        }
        catch(err){

            console.log(err);
            throw err;
            
        }
        
    }

}