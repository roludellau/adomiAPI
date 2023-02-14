'use strict';

const Hapi = require('@hapi/hapi')
import {Request, ResponseToolkit} from '@hapi/hapi'
//on importe la fonction getAllUsers depuis le fichier userController
import UserController from './controllers/userController'
import AgencyController from './controllers/agencyController'

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: UserController.getAllUsers
    })

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

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

