import { Request, ResponseObject, ResponseToolkit } from "hapi";

const db = require('../models/index')
import argon2 from 'argon2';
const sequelize = db.default.sequelize
const userModel = db.default.User
const agencyModel = db.default.Agency
const customerModel = db.default.User
const missionModel = db.default.Mission
const appointmentsModel = db.default.Appointment

export default class AppointmentController{


    static getAppointments = async(request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()

        try{
            const appointments = await appointmentsModel.findAll({ 
                include: [
                    { 
                        association: 'mission', 
                    },
                    {
                        association: 'carer',
                        attributes:['first_name', 'last_name', 'user_name', 'email', 'phone', 'street_name', 'street_number', 'post_code', 'city']
                    }
                
                ]});
            return appointments
        }
        catch (err){
            t.rollback()
            console.log(err)
            throw err
        }
    }

    static getAppointment = async(request: Request, h: ResponseToolkit) => {
        // const t = await sequelize.transaction()
        const id = request.params.id

        try{
            const appointments = await appointmentsModel.findOne({
                where:{id:id},
                include:[{
                    association:'mission',
                    include:{
                        association:'client',
                        // where:{idClient: id}
                    }
                }]
            })
            console.log(appointments)
            return appointments
        }
        catch (err){
            // t.rollback()
            console.log(err)
            throw err
        }
    }

    static addAppointment = async(request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        const input = request.query
        try{
            const appointment = await appointmentsModel.create({
                date: input.startDate,
                startHour: input.startHour,
                endHour: input.endHour,
                streetName: input.streetName,
                streetNumber: input.streetNumber,
                postCode: input.postCode,
                city: input.city,
                idCarer: input.idCarer,
                idMission: input.idMission
            })

            return appointment
        }
        catch(err){
            t.rollback()
            console.log(err)
            throw err
        }
    }

    static updateAppointment = async(request: Request, h: ResponseToolkit) => {
        const t = await sequelize.transaction()
        const id = request.params.id
        const input = request.query


        try{
            const appointment = await appointmentsModel.findOne({where:{id:id}})
            const updatedAppointment = await appointment.update({
                date: input.startDate,
                startHour: input.startHour,
                endHour: input.endHour,
                streetName: input.streetName,
                streetNumber: input.streetNumber,
                postCode: input.postCode,
                city: input.city,
                idCarer: input.idCarer,
                idMission: input.idMission
            })
            return updatedAppointment
        }
        catch(err){
            t.rollback()
            console.log(err)
            throw err
            
        }
    }

    static deleteAppointment = async(request: Request, h: ResponseToolkit) =>{
        const t = await sequelize.transaction()
        const id = request.params.id

        try{
            const count = appointmentsModel.destroy({where:{id:id}})
            return count
        }
        catch(err){
            t.rollback()
            console.log(err)
            throw err
            
        }
    }

    

}