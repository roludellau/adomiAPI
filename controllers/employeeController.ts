import { Request, ResponseToolkit } from "hapi";
import Jwt from '@hapi/jwt';
import argon2 from 'argon2';
import * as fs from 'fs/promises';
import { request } from "http";
const db = require('../models/index')
const sequelize = db.default.sequelize
const userModel = db.default.User
const rolesModel = db.default.User_Role

export default class EmployeeController {


    static getAllEmployees = async (request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        try {
            const employees = await userModel.findAll({
                attributes:['id','firstname','lastname'],
                include: [
                    {
                        association: 'role',
                        attributes: ['label'],
                        where:{label:'employee'}
                    }
                ],
            })
            return employees
        } 
        catch (err) {
            await t.rollback()
            console.log(err)
            throw err
        }
    }

    static getEmployeeById = async(request: Request, h:ResponseToolkit) => {
        const t = await sequelize.transaction()
        const idEmployee = request.params.idEmployee
        try {
            const employee = await userModel.findOne({
                attributes:['id','firstname','lastname','email','username','phone','street_name','street_number','post_code','city'],
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
                where: {id:idEmployee}
            })

            return employee
        }
        catch (err) {
            await t.rollback()
            console.log(err)
            throw err
        }
    }

    static getEmployeesFromAgencyId = async (request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        const idAgency = request.params.idAgency

        try{
            const employees = userModel.findAll({
                attributes:['id','firstname','lastname','email','username','phone'],
                include:[{
                    association:'agency',
                    attributes:['id','name','adress'],
                    where:{id: idAgency}
                }]
            })
        return employees
        }
        catch (err) {
            await t.rollback()
            console.log(err)
            throw err
        }
    }

    static addEmployee = async(request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        const input = request.query
        console.log(input);
        
        try {
            const employee = await userModel.create({
                firstName: input.firstname,
                lastName: input.lastname,
                email: input.email,
                password: input.password,
                userName: input.username,
                phone: input.phone,
                street_name: input.streetname,
                street_number: input.streetnumber,
                post_code: input.postcode,
                city: input.city,
                idRole: input.idrole,
                idAgency: input.idagency,
            })
            console.log(employee);
            return employee
        }
        catch (err) {
            console.log(err
                );
            
            throw err
        }
    }

    static deleteEmployee = async(request: Request, h:ResponseToolkit) => {
        const t = await sequelize.transaction()
        const id = request.params.id
        try{
            const count = await userModel.destroy({where: {id: id}})
            return count
        }
        catch (err){
            t.rollback()
            console.log(err);
            throw err
            
        }
    }

    static updateEmployee = async(request:Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        const id = request.params.id
        const input = request.query
        try{
            const user = userModel.findOne({where:{id:id}})

            if(user){
                userModel.update({
                    firstName: input.firstname,
                    lastName: input.lastname,
                    email: input.email,
                    password: input.password,
                    userName: input.username,
                    phone: input.phone,
                    street_name: input.streetname,
                    street_number: input.streetnumber,
                    post_code: input.postcode,
                    city: input.city,
                    idRole: input.idrole,
                    idAgency: input.idagency,
                },
                {
                    where:{
                        id:id
                    }
                })
                return user
            }

            return 0
        }
        catch (err){
            t.rollback()
            console.log(err)
            throw err

        }
        
    }


}