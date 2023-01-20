const db = require('../models/index')
const AgencyModel = db.default.Agency


const getAllAgencies = async () =>{
     let agencies = await AgencyModel.findAll()
     return agencies
}

export {getAllAgencies}