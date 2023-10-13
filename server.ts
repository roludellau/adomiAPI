'use strict';
const Hapi = require('@hapi/hapi')
import {Request, ResponseToolkit} from '@hapi/hapi'
import UserController from './controllers/userController'
import AgencyController from './controllers/agencyController'
import CustomerController from './controllers/customerController';
import Jwt from '@hapi/jwt';
import jwtParams from './middlewares/auth'
import EmployeeController from './controllers/employeeController';
import CarerController from './controllers/carerController'
import AppointmentController from './controllers/appointmentController';
import MissionController from './controllers/missionController';
const db = require('./models/index')
const sequelize = db.default.sequelize
import boom from '@hapi/boom'
import UserRolesController from './controllers/userRolesController';
const { exec } = require('child_process');
import startCronJobs from './scheduled/generate_appointments'

const init = async () => {

    startCronJobs()

    const server = Hapi.server({
        port: 8000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'], //default
            },
        }
    })

    await server.register(Jwt);
    server.auth.strategy('jwt_strategy', 'jwt', jwtParams)
    server.auth.default('jwt_strategy')


    server.ext('onRequest', async (r: Request, h :ResponseToolkit) => {
        try {await sequelize.authenticate()}
        catch (err) {
            console.log("err at db ping : ", err)
            return boom.serverUnavailable('Le serveur de bdd ne répond pas')
        }
        return h.continue
    })


    //TEST
    server.route({
        method: 'GET',
        path:'/',
        options: {auth: false},
        handler: (request: Request, h :ResponseToolkit) => {
            return h.response('Oï')
        }
    })

    //USERS
    server.route([
        {
            method: 'POST',
            path: '/sign-in',
            options: {auth: false},
            handler: UserController.signIn
        },
        {
            method: 'GET',
            path: '/users/{id}',
            handler: UserController.getUserInfo
        },
        {
            method: 'POST',
            path: '/users/{id}/general-request',
            handler: UserController.postGeneralRequest
        }

    ])


    //EMPLOYEES
    server.route([
        {
            method:'GET',
            path:'/employees',
            handler: EmployeeController.getAllEmployees
        },
        {
            method:'GET',
            path:'/employees/{idEmployee}',
            handler: EmployeeController.getEmployeeById
        },
        {
            method:'GET',
            path:'/employees/agency/{idAgency}',
            handler: EmployeeController.getEmployeesFromAgencyId
        },
        {
            method:'POST',
            path:'/employees',
            handler: EmployeeController.addEmployee
        },
        {
            method:'DELETE',
            path:'/employees/{id}',
            handler:EmployeeController.deleteEmployee
        },
        {
            method:'PATCH',
            path:'/employees/{id}',
            handler:EmployeeController.updateEmployee
        },
        {
            method:'GET',
            path:'/general-requests',
            handler:EmployeeController.getGeneralRequests
        },
        {
            method: 'GET',
            path: '/general-requests/{id}',
            handler: EmployeeController.getOneGeneralRequest
        }
    ])


    //AGENCIES
    server.route([
        {
            method:'GET',
            path:'/agencies',
            handler: AgencyController.getAllAgencies
        },
        {
            method:'GET',
            path:'/users/{id}/agency',
            handler: AgencyController.getUserAgency
        }
    ])

    //ROLES
    server.route({
        method:'GET',
        path:'/roles',
        handler: UserRolesController.getAllRoles
    })
    
    
    //CUSTOMERS
    server.route([
        {
            method: 'GET',
            path:'/customers',
            handler: CustomerController.getAllCustomers
        }, 
        {
            method: 'GET',
            path:'/customers/search',
            handler: CustomerController.customerSearch
        }, 
        {
            method: 'GET',
            path:'/customers/{id}',
            handler: CustomerController.getOneCustomer
        },
        
        {
            method: 'POST',
            path: '/customers',
            handler: CustomerController.createCustomer
        },

        {
            method: 'PATCH',
            path:'/customers/{id}',
            handler: CustomerController.updateCustomer
        },

        {
            method: 'DELETE',
            path:'/customer/{id}',
            handler: CustomerController.deleteCustomer
        }, 
        
        {
            method: 'GET',
            path:'/customers/{id}/agencies',
            handler: CustomerController.getCustomerAgency
        },

        {
            method: 'GET',
            path:'/customers/{id}/carers',
            handler: CustomerController.getCustomerCarers
        },

        {
            method: 'GET',
            path:'/customers/{id}/appointments',
            handler: CustomerController.getCustomerAppointments
        },

        {
            method: 'GET',
            path:'/customers/{id}/referents',
            handler: CustomerController.getCustomerReferent
        },
    ])

    //CARERS
    server.route([
        {
            method: 'POST',
            path: '/carers',
            handler: CarerController.createCarer
        },
        {
            method: 'GET',
            path: '/carers/{id}',
            handler: CarerController.getCarerById
        },
        {
            method: 'GET',
            path: '/carers',
            handler: CarerController.getAllCarers
        },
        {
            method: 'GET',
            path:'/carers/search',
            handler: CarerController.carerSearch
        }, 
        {
            method: 'PATCH',
            path: '/carers/{id}',
            handler: CarerController.updateCarer
        },
        {
            method: 'DELETE',
            path: '/carers/{id}', 
            handler: CarerController.deleteCarer
        },
        
        {
            method: 'GET',
            path: '/carers/{id}/customers', 
            handler: CarerController.getCarerCustomers 
        },
        {
            method: 'GET',
            path: '/carers/{id}/appointments', 
            handler: CarerController.getAppointments
        },
        {
            method: 'GET',
            path: '/carers/{id}/latestappointments',
            handler: CarerController.getLatestAppointments
        }
    ])
        //AVAILABILITIES
        server.route([
        {
            method: 'PUT',
            path: '/carers/{id}/availabilities', 
            handler: CarerController.addAvailability
        },
        {
            method: 'GET',
            path: '/carers/{id}/availabilities', 
            handler: CarerController.getAvailabilities
        },
        {
            method: 'DELETE',
            path: '/availabilities/{id}', 
            handler: CarerController.deleteAvailability
        }
    ])
    
    //APPOINTMENT
    server.route([
        {
            method: 'GET',
            path:'/appointments',
            handler: AppointmentController.getAppointments
        },

        {
            method: 'GET',
            path:'/appointments/{id}',
            handler: AppointmentController.getAppointment
        }
    ])

    //Missions
    server.route([
        {
            method: 'POST',
            path: '/missions',
            handler: MissionController.createMission
        },
        {
            method: 'GET',
            path: '/missions',
            handler: MissionController.getAllMissions
        },
        {
            method: 'GET',
            path: '/missions/{id}',
            handler: MissionController.getOneMission
        },
        {
            method: 'PATCH',
            path: '/missions/{id}',
            handler: MissionController.updateMission
        },
        {
            method: 'DELETE',
            path: '/missions/{id}',
            handler: MissionController.deleteMission
        },
        {
            method: 'GET',
            path: '/users/{id}/missions',
            handler: MissionController.getMissionsByUser
        },
    ])

    // SEED (attention, ne pas seeder à moins d'être en pleine re-init du serveur)
    server.route({
        method: 'PUT',
        path:'/db-seed-all',
        options: {auth: false},
        handler: (request: Request, h :ResponseToolkit) => {
            exec('npx sequelize db:seed:all', (err:any, stdout:any, stderr:any) => {
                if (err) {
                  console.log(err)
                  throw err
                }
                //console.log(`stdout: ${stdout}`);
                //console.log(`stderr: ${stderr}`);
            })
            return h.response().code(204)
        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
}



process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

