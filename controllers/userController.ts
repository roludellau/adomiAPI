const db = require('../models/index')
import { Request, ResponseToolkit } from "hapi";
const sequelize = db.default.sequelize
const userModel = db.default.User

export default class UserController {


    static getAllUsers = async (request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        try {
            const users = await userModel.findAll()
            console.log(users);
            
            return users
        } 
        catch (err) {
            await t.rollback()
            throw err
        }
    }
}

