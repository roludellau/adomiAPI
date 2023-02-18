import { Request, ResponseToolkit } from "hapi";
import argon2 from 'argon2';
import boom from '@hapi/boom'
import { UserAttributes } from '../models/user'
import { Error } from "sequelize";
const db = require('../models/index')
const sequelize = db.default.sequelize
const User = db.default.User
const Availability = db.default.Availability

export default class CarerController {

   static createCarer = async (req: Request, h: ResponseToolkit) => {
        if (await User.findOne({where:{lastName: req.query.lastName, firstName: req.query.firstName}})){
            return boom.conflict('Un utilisateur de ce nom existe déjà')
        }

        const t = await sequelize.transaction().then((t:PromiseFulfilledResult<any>) => t).catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }

        let payload: typeof User = {...req.query}
        payload.password = await argon2.hash(payload.password)
        payload.idRole = '3' //toujours

        let newCarer = await User.create(payload)
            .then((res: UserAttributes) => res)
            .catch((err:Error) => {
                t.rollback()
                return boom.badData('Les données fournies sont probablement mal formatées.')
            })
        newCarer.password = '' //pourpakivoi
        return newCarer
   }


   static getCarerById = async (req: Request, h: ResponseToolkit) => {
        return (
            await User.findByPk(req.params.id)
            .then((result: UserAttributes|null) => result )
            .catch((err: Error) => boom.boomify(err))
        )
   }

   
   static updateCarer = async (req: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction().then((t:PromiseFulfilledResult<any>) => t).catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }
        const payload = req.query
        const response = await User.update(payload, {where: {id:req.params.id}})
              .then((rowsAffected:number) => rowsAffected)
              .catch(() => { 
                  t.rollback() 
                  return boom.badData('Les données fournies sont probablement mal formatées.')
              })
        return response
    }

   


   static deleteCarer = async (req: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction().then((t:PromiseFulfilledResult<any>) => t).catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }
        const response = await User.destroy({where: {id: req.params.id}})
                            .then((rowsAffected:number) => rowsAffected)
                            .catch((err:Error) => { 
                                t.rollback() 
                                boom.boomify(err)
                            })
        return response

   } 


   static addAvailability = async (req: Request, h: ResponseToolkit) => {
    /*
    let payload = req.query
    let existing = await Availability.findOne({where:payload})
    if (existing){
        const linking = await Availability.update({
            include:[
                {
                    association: 'carer_has_availability'
                }
            ],
            where: {id:req.params.id}})
        .then((rowsAffected:number) => rowsAffected)
        .catch(() => { 
            return boom.badData('Les données fournies sont probablement mal formatées.')
        })
    }
    */
   }

   static getAvailabilities = async (req: Request, h: ResponseToolkit) => {

    }
   
}