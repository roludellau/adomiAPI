import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import boom from '@hapi/boom'
import * as fs from 'fs/promises';
const db = require('../models/index')
const sequelize = db.default.sequelize
const missionModel = db.default.Mission
const customerModel = db.default.customer


export default class MissionController {



    static createMission = async (request: Request, h: ResponseToolkit)=>{
        const t = await sequelize.transaction();

        try{

            const create =  await missionModel.create({
                startDate: request.query.startDate,
                startHour: request.query.startHour,
                endHour: request.query.endHour,
                streetName: request.query.streetName,
                streetNumber: request.query.streetNumber,
                postCode: request.query.postCode,
                city: request.query.city,
                validated: request.query.validated,
                idClient: request.query.idClient,
                idEmployee: request.query.idEmployee,
                idCarer: request.query.idCarer,
                idRecurence: request.query.idRecurence
    
            });

            return create

        }
        catch(err){
            console.log(err);
            throw err;
        }
        
    }


    static getAllMissions = async (request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        try {


            let missions = await missionModel.findAll(
            {attributes: ['startdate','startHour', 'endHour', 'streetName', 'streetNumber', 'postCode','city', 'validated', 'idClient', 'idEmployee'], 
            include: [
                {association:
                    'client', 
                    attributes: [
                        'street_name', 'street_number', 'post_code','city']}]
        })
            return missions
        } 
        catch (err) {
            await t.rollback()
            console.log(err)
            throw err
        }
    }

    static getOneMission = async (request: Request, h: ResponseToolkit) => {
    
        let idMission = request.params.id;

        try {


            let mission = await missionModel.findOne(
            {attributes: [
                'startdate','startHour', 'endHour', 'streetName', 'streetNumber', 'postCode','city', 'validated', 'idClient', 'idEmployee'],
            where:{
                id: idMission
            }, 
            include: [
                {association:
                'client', 
                attributes: [
                    'street_name', 'street_number', 'post_code','city']}]
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
        const input = request.query
        try{
            const mission = missionModel.findOne({where:{id:id}})

            if(mission){
                missionModel.update({
                    startDate: request.query.startDate,
                    startHour: request.query.startHour,
                    endHour: request.query.endHour,
                    streetName: request.query.streetName,
                    streetNumber: request.query.streetNumber,
                    postCode: request.query.postCode,
                    city: request.query.city,
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
                'id', 'startHour', 'endHour', 'startDate',  'validated', 'idClient', 'idEmployee', 'idCarer', 'idRecurence'
            ],
            where: {
                ["id"+role]: userId
            }
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

}
