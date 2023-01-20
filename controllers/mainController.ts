export {}
const db = require('../models/index')
// apres avoir require db, on recupere le model qu'on souhaite
const userModel = db.default.User

class mainController {


    static queryTransaction = async(req: Request) => {
        const t = await db.default.sequelize.transaction()
        try {
            return await userModel.findAll()
        }
        catch (error) {
            await t.rollback()
            console.log(error)
            throw (error)
        }
    }
    
}


module.exports = mainController
