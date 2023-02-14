import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
const db = require('../models/index')
const sequelize = db.default.sequelize
const userModel = db.default.User

export default class UserController {


    static getAllUsers = async (request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        try {
            const users = await userModel.findAll()
            return users
        } 
        catch (err) {
            await t.rollback()
            throw err
        } 
    }
    
    static generateToken(user:string){
        const token = Jwt.token.generate(
            {
                aud: 'api.adomi.fr',
                iss: 'api.adomi.fr',
                user: user,
            },
            {
                key: '../key/key.txt',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        )
        return token
    }

    

    static signIn = async (request: Request, h: ResponseToolkit) => {
        let username = request.query.username
        let password = request.query.password
        const t = await sequelize.transaction()
        try {
            const user = await userModel.findOne({
                attributes: ['firstName', 'lastname', 'email', 'password'],
                where: { userName: username }
            })
            if (await argon2.verify(user.password, password as string)){
                return this.generateToken(username as string)
            }
        }
        catch (err) {
            await t.rollback()
            throw err
        }
    }

}

