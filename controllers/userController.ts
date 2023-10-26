import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import boom from '@hapi/boom'
import * as fs from 'fs/promises';
const db = require('../models/index')
import {Error} from "sequelize";
const sequelize = db.default.sequelize
const userModel = db.default.User
import ValidationUtils from './validationUtils'

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
    
    static generateToken(username:string, role:string, audience?:string){
        //const key = async () => fs.readFile('../key/key.txt')
        console.log("token audience : ", audience)
        const token = Jwt.token.generate(
            {
                aud: audience || 'adomi',
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
        let payload = request.payload as {
            username: string
            password: string
        }

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
            token: this.generateToken(username as string, user.role.label, request.headers["origin"])
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

    static async postGeneralRequest(request: Request, h: ResponseToolkit) {
        try {
            const id = request.params.id
            if (!id) return boom.badRequest('veuillez fournir l\'id de l\'utilisateur dans l\'url.')
    
            const payload = (request.payload as {[key: string]: string})
            new ValidationUtils().escapeInputs(payload) // passed by reference
    
            const message = payload.message
            if (!message) return boom.badRequest('veuillez fournir un payload JSON contenant un attribut "message".')
    
            const res = await sequelize.query('INSERT INTO general_requests (request_string, user_id) VALUES ($1, $2)', 
                {
                    bind: [message, id],
                }
            )

            console.log('res', res)

            return h.response().code(201)    
        }
        catch(eur) {
            console.log(eur)
            return boom.badImplementation()
        }
    }

}

