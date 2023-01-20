export {}
const db = require('../models/index')
// apres avoir require db, on recupere le model qu'on souhaite
const userModel = db.default.User

class mainController {


    static queryTransaction = async(req: Request) => {
        
        //let test = await userModel.findAll()
        console.log(db)
        return true
    }

    
}


module.exports = mainController
