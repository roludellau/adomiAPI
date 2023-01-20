const db = require('../models/index')
// apres avoir require db, on recupere le model qu'on souhaite
const userModel = db.default.User

const getAllUsers = async(req: Request) => {

    let users = await userModel.findAll()
    return users
}



export = {getAllUsers}
