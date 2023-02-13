const db = require('../models/index')
// apres avoir require db, on recupere le model qu'on souhaite
const userModel = db.default.User

const getAllUsers = async(req: Request) => {

    let test = await userModel.findAll()

    return true
}



export = {getAllUsers}
