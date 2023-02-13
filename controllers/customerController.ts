const db = require('../models/index')

const customerModel = db.default.User;

const userRoleModel = db.default.User_Role;

export default class CustomerController{

    static getAllCustomers = async () =>{

        try{
             let customers = await customerModel.findAll({include: {model: userRoleModel, where:{libelle: "customer"}, as: 'role'}})
             console.log(customers);
             
             return customers
        }
        catch(err){
         console.log(err);
         
        }
         
     }
     
     
     static getOneCustomer =  async (userId: number) =>{
     
         try{
             let customer = customerModel.findOne({include: {model: userRoleModel, where:{libelle: "customer", id:userId}, as: 'role'}})
     
             return customer
     
         }
         catch(err){
            throw err
         }
     }

}
