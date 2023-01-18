import {sequelize, DataTypes} from '../dbconfig/db.js'
import {Request, ResponseToolkit } from "@hapi/hapi";
import Core from './Core'
import Crypto from 'crypto'

export default class User extends Core{

    static UserModel = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        lastname: {
            type: DataTypes.STRING,
        },
        firstname: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING(1234),
        },
        phone: {
            type: DataTypes.INTEGER,
        },
        mail: {
            type: DataTypes.STRING(1234),
        },
        street_name: {
            type: DataTypes.STRING,
        },
        street_number: {
            type: DataTypes.STRING,
        },
        post_code: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        }
    })

    static CustomerModel = sequelize.define('customer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        id_Agency : {
            type: DataTypes.INTEGER,
        },
        id_Employee  : {
            type: DataTypes.INTEGER,
        },
    })

    static {
        this.UserModel.hasOne(this.CustomerModel)
        this.CustomerModel.belongsTo(this.UserModel, {foreignKey: 'id'})
    }


    static getAllUsers(): Promise<any[]> {
        return User.UserModel.findAll()
    }

    static async addUser(request:any): Promise<any> {
        let data = request.query
        let existingUser = await User.UserModel.findOne({ where: { firstname: data.firstname,  lastname: data.lastname } })
        if (!existingUser){
            const firstQuery = await User.UserModel.create({
                    lastname : data.lastname,
                    firstname : data.firstname,
                    username : data.username,
                    password : Crypto.createHash('md5').update(data.password).digest('hex'),
                    phone : data.phone,
                    mail : data.mail,
                    street_name : data.street_name,
                    street_number : data.street_number,
                    post_code : data.post_code,
                    city : data.city
                })
                const lastId = firstQuery.dataValues.id
                const secondQuery = await User.CustomerModel.create({
                    id : lastId,
                    id_Agency : data.id_Agency,
                    id_Employee : data.id_Employee,
                })
                const createdUser = firstQuery.dataValues
                const createdCustomer = secondQuery.dataValues
                return {createdUser, createdCustomer}
        } else {
            return 'existing'
        }
    }

}

