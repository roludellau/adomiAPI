'use strict';
import {Server, Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";
import User from './Models/User.js'

//Gestion d'erreur à l'initialisation
process.on('unhandledRejection', (err) => {console.log(err);process.exit(1);})

//Notre serveur 
const init = async () => {

    const server = new Server({
        host: 'localhost',
        port: 3000,
    })

    server.route([
        {
            method: 'GET',
            path: ('/'),
            handler: (request: Request, h: ResponseToolkit) => {
                return 'Bonjour les copains'
            }
        },
        {
            method: 'GET',
            path: '/users',
            handler: (request: Request, h: ResponseToolkit) => {
                return User.queryTransaction(request, User.getAllUsers)
            }
        },
        {
            method: 'POST',
            path: '/customers',
            handler: (request: Request, h: ResponseToolkit) => {
                return User.queryTransaction(request, User.addUser)
            }
        }
    ])

    await server.start();

    console.log(`Le serveur court à l'adresse ${server.info.uri}`);
}


init();

