const db = require('../models/index')

const customerModel = db.default.User

const getAllCustomers = customerModel.findAll().then((data: any)=>{
    
    console.log(data);
    
})