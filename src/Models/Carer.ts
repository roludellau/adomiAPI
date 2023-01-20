import {sequelize, DataTypes} from '../dbconfig/db.js'
import {Request, ResponseToolkit } from "@hapi/hapi";
import Crypto from 'crypto'
import User from '../../adomiAPI/src/Models/User';


export default class Caresr extends User {


    static CarerModel = sequelize.define('carer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        perimeter  : {
            type: DataTypes.INTEGER,
        },
        id_appointment : {
            type: DataTypes.INTEGER,
    },
},
    {
        tableName: 'carer'
    })

    static {
        this.UserModel.hasOne(this.CarerModel)
        this.CarerModel.belongsTo(this.UserModel, {foreignKey: 'id'})
    }

}