'use strict';

import { ResponseToolkit } from "hapi";


const Hapi = require('@hapi/hapi');
//on importe la fonction getAllUsers depuis le fichier userController
const { getAllUsers } = require("./controllers/userController");
const {getAllAgencies} = require("./controllers/agencyController")

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    

    server.route({
        method: 'GET',
        path: '/',
        handler: getAllUsers
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

