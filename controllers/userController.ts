import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import boom from '@hapi/boom'
import * as fs from 'fs/promises';
const db = require('../models/index')
import {Error} from "sequelize";
const sequelize = db.default.sequelize
const userModel = db.default.User

export default class UserController {

    static getAllUsers = async (request: Request, h: ResponseToolkit) => {
        try {
            const users = await userModel.findAll()
            return users
        } 
        catch (err) {
            console.log(err)
            throw err
        }
    }
    
    static generateToken(username:string, role:string){
        //const key = async () => fs.readFile('../key/key.txt')
        const token = Jwt.token.generate(
            {
                aud: 'api.adomi.fr',
                iss: 'api.adomi.fr',
                user: username,
                userRole: role
            },
            {
                key: 'IceTea',
                algorithm: 'HS512'
            },
            {
                ttlSec: 86400 // 24 hours. Bon token ! 🔑 🐶 🐕‍🦺
            }
        )
        return token
    }



    static signIn = async (request: Request, h: ResponseToolkit) => {

        try {await sequelize.authenticate()}
        catch {return boom.serverUnavailable('Le serveur de bdd ne répond pas')}

        type Payload = {
            username: string
            password: string
        }
        let payload = request.payload as Payload

        let [username, password] = [payload.username, payload.password]

        if (!username || !password){
            console.error(typeof payload)
            return boom.badData('Les éléments fournis sont mal formatés: veuillez fournir un nom d\'utilisateur et un mot de passe')
        }

        const user = await userModel.findOne({
            attributes: ['id', 'first_name', 'last_name', 'email', 'password'],
            where: { user_name: username },
            include:{
                association: 'role',
                attributes:['label'],
            }
        })
        .catch((err: Error)=> { console.log(err); return false})

        if (user == false) return boom.badImplementation('Une erreur inconnue est survenue')
        if (user == undefined || !await argon2.verify(user.password, password)){
            return boom.unauthorized('Le nom d\'utilisateur ou le mot de passe est incorrect')
        }

        return {
            id: user.id, 
            token: this.generateToken(username as string, user.role.label)
        }
    }

    static getUserInfo = async (request: Request, h: ResponseToolkit) => {        
        let id = request.params.id
        if (isNaN(parseInt(id))){
            return boom.badData("Veuillez fournir un nombre entier comme Id en query param")
        }

        try {
            return await userModel.findOne({
                attributes: ['id', 'first_name', 'last_name', 'user_name', 'email', 'phone', 'street_name', 'street_number', 'post_code', 'city', 'id_role', 'id_agency'],
                include: [
                    {
                        association: 'role',
                        attributes:['label'],
                        where:{label:'employee'}
                    },
                    {
                        association:'agency',
                        attributes:['name','adress']
                    },
                ],
                where: { id: id }
            })
        }
        catch (err) {
            console.log(err)
            throw err
        }
    }

}

