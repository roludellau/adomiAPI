import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import * as fs from 'fs/promises';
const db = require('../models/index')
const sequelize = db.default.sequelize
const missionModel = db.default.Mission

export default class UserController {


    static getAllMissions = async (request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        try {
            const missions = await missionModel.findAll({where:{idClient:customer.dataValues.id}, include:'users',
            attributes: ['streetname', 'streetnumber', 'postcode','city']},{attributes: ['startdate','starthour', 'endhour', 'streetname', 'streetnumber', 'postcode','city', 'validated', 'idClient', 'idEmployee']})
            return missions
        } 
        catch (err) {
            await t.rollback()
            console.log(err)
            throw err
        }
    }
}