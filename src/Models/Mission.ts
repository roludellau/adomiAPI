import {sequelize, DataTypes} from '../dbconfig/db.js'
import {Request, ResponseToolkit } from "@hapi/hapi";
import Core from './Core'

export default class Mission extends Core{

    static MissionModel = sequelize.define('mission', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        start_date: {
            type: DataTypes.DATE,
        },
        start_hour: {
            type: DataTypes.DATE,
        },
        end_hour: {
            type: DataTypes.DATE,
        },
        street_name: {
            type: DataTypes.STRING,
        },
        street_number: {
            type: DataTypes.INTEGER,
        },
        post_code: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        validated: {
            type: DataTypes.BOOLEAN,
        },
        id_Carer: {
            type: DataTypes.INTEGER,
        },
        id_Customer : {
            type: DataTypes.INTEGER,
        },
        id_Employee: {
            type: DataTypes.INTEGER,
        },
        id_Recurence : {
            type: DataTypes.INTEGER,
        }
    })

}