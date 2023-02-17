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

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    await server.register(Jwt);
    server.auth.strategy('jwt_strategy', 'jwt', jwtParams)
    // server.auth.default('jwt_strategy');

    
    //TEST
    server.route({
        method: 'GET',
        path:'/test',
        handler: (request: Request, h :ResponseToolkit) => {
            return 'oui'
        }
    })

    //USERS
    server.route([
        {
            method: 'GET',
            path: '/sign-in',
            options: {auth: false},
            handler: UserController.signIn
        },
        {
            method: 'GET',
            path: '/users/{id}',
            handler: UserController.getUserInfo
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
        }
    ])


    //AGENCIES
    server.route({
        method:'GET',
        path:'/agencies',
        handler: AgencyController.getAllAgencies
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
            method: 'PUT',
            path: '/carers/{id}/availabilities', 
            handler: CarerController.addAvailability
        },
        {
            method: 'GET',
            path: '/carers/{id}/availabilities', 
            handler: CarerController.getAvailabilities
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
        }])

    await server.start();
    console.log('Server running on %s', server.info.uri);
}



process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

