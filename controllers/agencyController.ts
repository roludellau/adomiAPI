import { Request, ResponseToolkit } from "hapi";
import Boom from "@hapi/boom"
const db = require('../models/index')
const AgencyModel = db.default.Agency
const UserModel = db.default.User

export default class AgencyController {

     static async getAllAgencies(req: Request, h: ResponseToolkit) {
          let agencies = await AgencyModel.findAll()
          return agencies
     }

     static async getUserAgency(req: Request, h: ResponseToolkit) {
          const id = req.params.id
          if (!id) return Boom.badRequest("veuillez fournir un id d'utilisateur")
          
          let agencies = await UserModel.findByPk(id, {
               attributes: [],
               include: {
                    association: 'agency',
                    attributes: ['name', 'adress'],
               }
          })
          .catch((err: Error) => {console.log(err); return null})

          if (agencies === null) {
               return Boom.badImplementation()
          }
          
          return agencies
     }

}


