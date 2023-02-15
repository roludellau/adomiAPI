'use strict';
const Hapi = require('@hapi/hapi')
import {Request, ResponseToolkit} from '@hapi/hapi'
import UserController from './controllers/userController'
import AgencyController from './controllers/agencyController'
import CustomerController from './controllers/customerController';
import Jwt from '@hapi/jwt';
import jwtParams from './middlewares/auth'

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
        },
        {
            method: 'POST',
            path: '/user/new',
            handler: UserController.createUser
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
    server.route([{
        method: 'GET',
        path:'/customers',
        handler: CustomerController.getAllCustomers
    },
    {
        method: 'GET',
        path:'/customer/{id}',
        handler: CustomerController.getOneCustomer
    }])

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

