const db = require('../models/index')
const UserRoleModel = db.default.User_Role

export default class UserRolesController {

     static getAllRoles = async () =>{
        try{
            const roles = await UserRoleModel.findAll()
            return roles
        }
        catch(err){
            console.log(err)
            throw err
        }

     }
}

