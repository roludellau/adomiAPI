'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = require("@hapi/hapi");
const User_js_1 = __importDefault(require("./Models/User.js"));
//Gestion d'erreur à l'initialisation
process.on('unhandledRejection', (err) => { console.log(err); process.exit(1); });
//Notre serveur 
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new hapi_1.Server({
        host: 'localhost',
        port: 3000,
    });
    server.route([
        {
            method: 'GET',
            path: ('/'),
            handler: (request, h) => {
                return 'Bonjour les copains';
            }
        },
        {
            method: 'GET',
            path: '/users',
            handler: (request, h) => {
                return User_js_1.default.queryTransaction(request, User_js_1.default.getAllUsers);
            }
        },
        {
            method: 'POST',
            path: '/customers',
            handler: (request, h) => {
                return User_js_1.default.queryTransaction(request, User_js_1.default.addUser);
            }
        }
    ]);
    yield server.start();
    console.log(`Le serveur court à l'adresse ${server.info.uri}`);
});
init();
