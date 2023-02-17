import { Request, ResponseToolkit } from "hapi";
import argon2 from 'argon2';
import boom from '@hapi/boom'
import { UserAttributes } from '../models/user'
import Sequelize, { Error } from "sequelize";
import { Resolver } from "dns";
const db = require('../models/index')
const sequelize = db.default.sequelize
const User = db.default.User
const Availability = db.default.Availability

export default class CarerController {

   static createCarer = async (req: Request, h: ResponseToolkit) => {
        let payload = req.query
        payload.password = await argon2.hash(payload.password as string)
        payload.idRole = '3' //toujours

        if (await User.findOne({where:{lastName: req.query.lastName, firstName: req.query.firstName}})){
            return boom.conflict('Un utilisateur de ce nom existe déjà')
        }

        const t = await sequelize.transaction()
            .then((t:PromiseFulfilledResult<any>) => t)
            .catch(() => false)
        if (t == false){
            return boom.serverUnavailable('Allume ton WAMP, patate !')
        }

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
        let payload = req.query
        let existing = await Availability.findOne({where:payload})

    //Si la dispo existe
        if (existing){
            const isLinked = await sequelize.query(
                "SELECT `idCarer`"
                + " FROM `carer_has_availabilities`"
                + " WHERE (idAvailability = :idExisting) AND (idCarer = :idCarer)",
                { 
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: { idExisting : existing.id, idCarer: req.params.id},
                }
            ).then((result:any[]) => result[0]).catch((err: Error) => console.log(err))
            
        //S'il est lié à cette dispo
            if (isLinked){
                console.log(isLinked)
                return boom.conflict('L\'auxiliaire a déjà ce créneau associé à son compte')
            }

        //S'il n'est pas lié à cette dispo
            const addLink = await sequelize.query(
                "INSERT INTO `carer_has_availabilities` (idCarer, idAvailability)"
                + " VALUES (:idCarer, :idAvailability)",
                {
                    type: Sequelize.QueryTypes.SELECT ,
                    replacements: {
                        idCarer : req.params.id,
                        idAvailability : existing.id
                    }
                }
            ).then(() => existing /*Retourne la dispo existante*/).catch((err: Error) => console.log(err))
            return addLink
        }

    //Crée la dispo et lie le carer
        const t = await sequelize.transaction()
        try {
            const newAvailability = await Availability.create(payload)
            await sequelize.query(
                "INSERT INTO `carer_has_availabilities` (idCarer, idAvailability)"
                + " VALUES (:idCarer, :idAvailability)",
                {
                    
                    replacements: {
                        idCarer : req.params.id,
                        idAvailability : newAvailability.id
                    }
                }
            )
            return newAvailability
        }
        catch (err){
            console.log(err)
            t.rollback()
            return boom.badData('jsp')
        }
   }


   static getAvailabilities = async (req: Request, h: ResponseToolkit) => {
        const result = await sequelize.query(
            "SELECT `availabilities`.`week_day`, `availabilities`.`start_hour`, `availabilities`.`end_hour`"
            + " FROM `users`"
            + " JOIN `carer_has_availabilities` ON `users`.`id` = `carer_has_availabilities`.`idCarer`"
            + " JOIN `availabilities` ON `carer_has_availabilities`.`idAvailability` = `availabilities`.`id`"
            + " WHERE `users`.`id` = :carerId",
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: {carerId: req.params.id}
            }
        )
        .then((result:PromiseFulfilledResult<any>) => result)
        .catch((err:Error) => {boom.serverUnavailable(); console.log(err)})
        return result
    }
   
}


