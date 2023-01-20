export {}
const db = require('../models/index')

//const BigSequelize  = db.default.Sequelize
const sequelize = db.default.sequelize
const userModel = db.default.User



class userController {


    static getAllUsers = async (req: Request) => {
        const t = await sequelize.transaction()
        try {
            let test = await userModel.findAll() 
            return test
        } 
        catch (error) {
            throw (error)
            await t.rollback();
        }
    }

    
}




module.exports = userController
