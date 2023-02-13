const db = require('../models/index')

const customerModel = db.default.User;

const userRoleModel = db.default.User_Role;

const getAllCustomers = async () =>{

   try{
        let customers = await customerModel.findAll({include: {model: userRoleModel, where:{libelle: "customer"}, as: 'role'}})
        console.log(customers);
        
        return customers
   }
   catch(err){
    console.log(err);
    
   }
    
}

export{getAllCustomers}