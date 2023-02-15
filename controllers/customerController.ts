import { Request, ResponseToolkit } from "hapi";

const db = require('../models/index')
const sequelize = db.default.sequelize
const userModel = db.default.User
const RoleModel = db.default.Role
const customerModel = db.default.User

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
                include: { 
                    association: 'role', 
                    attributes: ['label']} });

            return customer;
        }
        catch(err){

            console.log(err);
            
        }
    }

}