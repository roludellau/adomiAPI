'use strict';

const Hapi = require('@hapi/hapi');
import { Request, ResponseToolkit } from "hapi";
//on importe la fonction getAllUsers depuis le fichier userController
const userController = require("./controllers/userController");
const {getAllAgencies} = require("./controllers/agencyController")
const mainController = require('./controllers/mainController')

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    

    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit) => {
            return mainController.queryTransaction()
        }
    });

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
        handler: getAllAgencies
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

