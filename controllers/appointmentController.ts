import { Request, ResponseObject, ResponseToolkit } from "hapi";

const db = require('../models/index')
import argon2 from 'argon2';
import validator from "validator";
const sequelize = db.default.sequelize
const userModel = db.default.User
const agencyModel = db.default.Agency
const customerModel = db.default.User
const missionModel = db.default.Mission
const appointmentsModel = db.default.Appointment
import { AppointmentInterface } from '../models/appointment'
import ValidationUtils from '../controllers/validationUtils'

export default class AppointmentController {

    static getAppointments = async(request: Request, h: ResponseToolkit) => {
        try {
            const appointments = await appointmentsModel.findAll({ 
                include: [
                    { 
                        association: 'mission',
                        include:{
                            association:'client',
                            // where:{idClient: id}
                        }
                    },
                    {
                        association: 'carer',
                        attributes:['first_name', 'last_name', 'user_name', 'email', 'phone', 'street_name', 'street_number', 'post_code', 'city']
                    }
                
                ],
                order: [
                        ['date', 'DESC']
                ]});
            return appointments
        }
        catch (err){
            console.log(err)
            throw err
        }
    }

    static getAppointment = async(request: Request, h: ResponseToolkit) => {
        const id = request.params.id

        try {
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
            console.log(err)
            throw err
        }
    }

    static addAppointment = async(request: Request, h: ResponseToolkit) => {
        const input = request.query
        try{
            const appointment = await appointmentsModel.create({
                date: input.startDate,
                startHour: input.startHour,
                endHour: input.endHour,
                streetName: validator.escape(input.streetName as string),
                streetNumber: input.streetNumber,
                postCode: input.postCode,
                city: validator.escape(input.city as string),
                idCarer: input.idCarer,
                idMission: input.idMission
            })

            return appointment
        }
        catch(err){
            console.log(err)
            throw err
        }
    }

    static updateAppointment = async(request: Request, h: ResponseToolkit) => {
        const id = request.params.id
        const input = request.query

        try{
            const appointment = await appointmentsModel.findOne({where:{id:id}})
            const updatedAppointment = await appointment.update({
                date: input.startDate,
                startHour: input.startHour,
                endHour: input.endHour,
                streetName: validator.escape(input.streetName as string),
                streetNumber: input.streetNumber,
                postCode: input.postCode,
                city: validator.escape(input.city as string),
                idCarer: input.idCarer,
                idMission: input.idMission
            })
            return updatedAppointment
        }
        catch(err){
            console.log(err)
            throw err
            
        }
    }

    static deleteAppointment = async(request: Request, h: ResponseToolkit) =>{
        const id = request.params.id

        try{
            const count = appointmentsModel.destroy({where:{id:id}})
            return count
        }
        catch(err){
            console.log(err)
            throw err
            
        }
    }

    static async no_handler_create_appointment (appt: Partial<AppointmentInterface>) {
        const val = new ValidationUtils()
        val.escapeInputs(appt)
        try {
            const newAppt = await appointmentsModel.create(appt)
            return newAppt
        }
        catch (err: any) {
            let errors = val.no_handler_get_sequelize_error(err)
            errors.forEach((err) => console.error(err))
        }
    }

    static async no_handler_get_appointment (idMission: string): Promise<{id: string, date: string} | void | null> {
        try {
            const lastAppt = await appointmentsModel.findOne({
                attributes: ['id', 'date'],
                where: { idMission: idMission },
                order: [[ 'date', 'DESC' ]],            
            })
            return lastAppt
        }
        catch (err: any) {
            let errors = new ValidationUtils().no_handler_get_sequelize_error(err)
            errors.forEach((err) => console.error(err))
            return null
        }
    }

}