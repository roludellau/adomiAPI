import {sequelize, DataTypes} from '../dbconfig/db.js'
import {Request, ResponseToolkit } from "@hapi/hapi";


export default class Core {

    static async queryTransaction (request: any, query: (request: Request) => Promise<any>) {
        const t = await sequelize.transaction()
        try {
          return query(request)
        }
        catch (error){
          await t.rollback()
          throw error
        }
    }


}