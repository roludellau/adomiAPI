'use strict';
const Hapi = require('@hapi/hapi')
import {Request, ResponseToolkit} from '@hapi/hapi'
import UserController from './controllers/userController'
import AgencyController from './controllers/agencyController'
import CustomerController from './controllers/customerController';
import Jwt from '@hapi/jwt';
import jwtParams from './middlewares/auth'
import EmployeeController from './controllers/employeeController';

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    await server.register(Jwt);
    server.auth.strategy('jwt_strategy', 'jwt', jwtParams)
    // server.auth.default('jwt_strategy');


    //USER
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


    //EMPLOYEE
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
        }
    ])



    server.route({
        method: 'GET',
        path:'/test',
        handler: (request: Request, h :ResponseToolkit) => {
            return 'oui'
        }
    })

    //routes pour les agences
    server.route({
        method:'GET',
        path:'/agencies',
        handler: AgencyController.getAllAgencies
    })

    //Routes Customers
    server.route([
        {
            method: 'GET',
            path:'/customers',
            handler: CustomerController.getAllCustomers
        },
        
        {
            method: 'POST',
            path: '/customers',
            handler: CustomerController.createCustomer
        },

        {
            method: 'GET',
            path:'/customers/{id}',
            handler: CustomerController.getOneCustomer
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
        }
    ])
    
    server.route({
        method:'GET',
        path:'/missions',
        handler: MissionController.getAllMissions
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

