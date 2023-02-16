import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import * as fs from 'fs/promises';
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
            console.log(err)
            throw err
        }
    }
    
    static generateToken(username:string){
        //const key = async () => fs.readFile('../key/key.txt')
        const token = Jwt.token.generate(
            {
                aud: 'api.adomi.fr',
                iss: 'api.adomi.fr',
                user: username,
            },
            {
                key: 'IceTea',
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
                attributes: ['id', 'firstName', 'lastname', 'email', 'password'],
                where: { userName: username }
            })
            if (await argon2.verify(user.password, password as string)){
                return {id: user.id, token: this.generateToken(username as string)}
            }
        }
        catch (err) {
            await t.rollback()
            console.log(err)
            throw err
        }
    }

    static getUserInfo = async (request: Request, h: ResponseToolkit) => {

        let auth = request.auth
        console.log(auth)
        
        let id = request.params.id
        const t = await sequelize.transaction()
        try {
            const user = await userModel.findOne({
                attributes: ['firstName', 'lastName', 'userName', 'email', 'phone', 'street_name', 'street_number', 'post_code', 'city'],
                where: { id: id }
            })
            return user
        }
        catch (err) {
            await t.rollback()
            throw err
        }
        
    }

}

