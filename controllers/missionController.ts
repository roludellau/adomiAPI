import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import boom from '@hapi/boom'
import * as fs from 'fs/promises';
import { exit } from "process";
import validator from "validator";
import ValidationUtils from "./validationUtils";
const db = require('../models/index')
const sequelize = db.default.sequelize
const missionModel = db.default.Mission
const customerModel = db.default.customer
import { type MissionInterface } from "../models/mission";
import {type ValidationError} from 'sequelize'

export default class MissionController {


    static createMission = async (request: Request, h: ResponseToolkit) => {
        const formData = typeof request.payload == "string" ? JSON.parse(request.payload) : request.payload as any
        const valid = new ValidationUtils()
        valid.escapeInputs(formData)
        try {
            const create =  await missionModel.create(formData);
            return create
        }
        catch(err){
            if (!(err as any).errs){
                console.log(err);
                return boom.badImplementation()
            }
            return valid.getSequelizeErrors(err as ValidationError, h)
        }
        
    }


    static getAllMissions = async (r: Request, h: ResponseToolkit) => {
        const filter = r.query.filter as string
        const value = r.query.value as string

        try {
            let missions = await missionModel.findAll({
                attributes: ['id', 'startDate', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode','city', 'validated', 'idClient', 'idEmployee'], 
                include: [
                    {
                        association: 'client', 
                        attributes: [ 'first_name', 'last_name', 'user_name', 'street_name', 'street_number', 'post_code' ,'city' ]
                    },
                    {
                        association: 'carer', 
                        attributes: [ 'first_name', 'last_name', 'user_name' ]
                    },
                    {
                        association: 'employee', 
                        attributes: [ 'first_name', 'last_name', 'user_name' ]
                    },
                    {
                        association: 'recurence', 
                        attributes: [ 'recurence_type']
                    }
                ],
                where: filter && value ? {[filter]: [value]} : {}
            })
            if (missions.length == 0){
                return h.response({message: "Aucune mission trouvée, vérifiez peut-être la validité des params \"filter\" et \"value\". (e.g Indiquez 1 pour true)"})
                       .code(204)
            }   
            return missions
        }
        catch (err) {
            console.log(err)
            return boom.notImplemented("Une erreur serveur est survenue, il se pourrait que la valeur \"filter\" que vous avez indiquée soit invalide.")
        }
    }

    static getOneMission = async (request: Request, h: ResponseToolkit) => {
    
        let idMission = request.params.id;

        try {

            let mission = await missionModel.findOne(
            {attributes: [
                'id','startDate','startHour', 'endHour', 'streetName', 'streetNumber', 'postCode', 'city', 'validated', 'idClient', 'idEmployee','idCarer'],
            where:{
                id: idMission
            }, 
            include: [
                {
                    association:'client', 
                    attributes: [ 'first_name','last_name','phone','email','street_name', 'street_number', 'post_code','city' ]
                },{
                    association:'carer',
                    attributes: [ 'first_name','last_name','phone','email','street_name', 'street_number', 'post_code','city' ]
                },{
                    association: 'recurence',
                    attributes: ['id']
                }
            
            ]
        })
            return mission
        } 
        catch (err) {
            
            console.log(err)
            throw err
        }
    }

    static deleteMission = async (request:Request, h: ResponseToolkit)=>{


            try{
                
                let count = await missionModel.destroy({
                    where:{
                        id: request.params.id
                    }
                })

 
                return count

            }
            catch(err){

                console.log(err);
                throw err
                
            }

        
    }

    static updateMission = async(request:Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        const id = request.params.id
        const formData = request.payload as any
        console.log(" Passe dans updateMission ---------------")
        console.log(formData)
        try{
            const mission = missionModel.findOne({where:{id:id}})

            if(mission){
                missionModel.update({
                    startDate: request.query.startDate,
                    startHour: request.query.startHour,
                    endHour: request.query.endHour,
                    streetName: validator.escape(request.query.streetName as string),
                    streetNumber: request.query.streetNumber,
                    postCode: request.query.postCode,
                    city: validator.escape(request.query.city as string),
                    validated: request.query.validated,
                    idClient: request.query.idClient,
                    idEmployee: request.query.idEmployee,
                    idCarer: request.query.idCarer,
                    idRecurence: request.query.idRecurence
                },
                {
                    where:{
                        id:id
                    }
                })
                return mission
            }

            return 0
        }
        catch (err){
            t.rollback()
            console.log(err)
            throw err
        }
        
    }
    

    static async getMissionsByUser(r:Request, h: ResponseToolkit){
        const userId = r.params.id
        let role = r.query.role
        if (isNaN(parseInt(userId))){
            return boom.badData("Veuillez fournir un nombre entier comme ID dans l'url")
        }
        if (role != "client" && role != "carer" && role != "employee") {
            return boom.badData("Veuillez fournir le role de l'utilisateur en query param (?role=client|carer|employee)")
        }

        role = role.charAt(0).toUpperCase() + role.slice(1)

        const missions = missionModel.findAll({
            attributes: [
                'id', 'startHour', 'endHour', 'startDate', 'streetNumber', 'streetName', 'postCode', 'city', 'validated', 'idClient', 'idEmployee', 'idCarer', 'idRecurence'
            ],
            where: {
                ["id"+role]: userId
            },
            include:[
                {
                    association:'client',
                    attributes:['first_name','last_name','street_number','street_name','post_code','city']
                },
                {
                    association:'carer',
                    attributes:['first_name','last_name','street_number','street_name','post_code','city']
                }
            ]
        })
        .catch((err: Error) => {
            console.log(err)
            throw boom.boomify(err)
        })

        if (!missions){
            return
        }
        
        return missions
    }


    static not_handler_get_all_missions = async (filterOption?: {[filter: string]: string}): Promise<MissionInterface[] | []> => {
        const filter = filterOption?.entries[0][0] || null
        const value = filterOption?.entries[0][1] || null

        try {
            let missions = await missionModel.findAll({
                attributes: ['id', 'startDate', 'startHour', 'endHour', 'streetName', 'streetNumber', 'postCode','city', 'validated', 'idClient', 'idEmployee'], 
                include: [
                    {
                        association: 'client', 
                        attributes: [ 'first_name', 'last_name', 'user_name', 'street_name', 'street_number', 'post_code' ,'city' ]
                    },
                    {
                        association: 'carer', 
                        attributes: [ 'first_name', 'last_name', 'user_name' ]
                    },
                    {
                        association: 'employee', 
                        attributes: [ 'first_name', 'last_name', 'user_name' ]
                    },
                    {
                        association: 'recurence', 
                        attributes: [ 'recurence_type']
                    }
                ],
                where: filter && value ? {[filter]: [value]} : {}
            })

            if (missions.length == 0) {
                console.log("Aucune mission trouvée. Peut-être vérifiez les filtres")
            }

            return missions
        }
        catch (err) {
            console.log("err dans not_handler_get_all_missions", err)
            return []
        }
    }

}
