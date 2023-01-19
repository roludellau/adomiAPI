const db = require('../models/index')
// apres avoir require db, on recupere le model qu'on souhaite
const userModel = db.default.User

const getAllUsers = async(req: Request) => {
    console.log(db.default.User)
    let test = await userModel.findAll()
    console.log('quelque chose',test)
    return true
}



export = {getAllUsers}
