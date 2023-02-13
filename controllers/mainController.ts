export {}
const db = require('../models/index')
import { Request, ResponseToolkit } from "hapi";
import { userController } from './userController'
// apres avoir require db, on recupere le model qu'on souhaite
const userModel = db.default.User



class mainController {

    
}


module.exports = mainController
