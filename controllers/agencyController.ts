const db = require('../models/index')
const AgencyModel = db.default.Agency

export default class AgencyController {

     static getAllAgencies = async () =>{
          let agencies = await AgencyModel.findAll()
          return agencies
     }

}


