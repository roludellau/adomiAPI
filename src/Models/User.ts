import {sequelize, DataTypes} from '../dbconfig/db.js'
import {Request, ResponseToolkit } from "@hapi/hapi";
import Crypto from 'crypto'

export default class User {

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
    }, 
    {
        tableName: 'user'
    })

    static CustomerModel = sequelize.define('customer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING(1234),
        },
        id_Agency : {
            type: DataTypes.INTEGER,
        },
        id_Employee  : {
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: 'customer'
    })

    static {
        this.UserModel.hasOne(this.CustomerModel)
        this.CustomerModel.belongsTo(this.UserModel, {foreignKey: 'id'})
    }

    static async queryTransaction (request: Request, query: (request: Request) => Promise<any>) {
        const t = await sequelize.transaction()
        try {
          return query(request)
        }
        catch (error){
          await t.rollback()
          throw error
        }
    }

    static getAllUsers(): Promise<any[]> {
        return User.UserModel.findAll()
    }
    
    static async addUser(request:any): Promise<any> {
        let data = request.query
        let existingUser = await User.UserModel.findOne({ where: { firstname: data.firstname,  lastname: data.lastname } })
        if (!existingUser){
            return (
                User.UserModel.create({
                    lastname : data.lastname,
                    firstname : data.firstname,
                    phone : data.phone,
                    mail : data.mail,
                    street_name : data.street_name,
                    street_number : data.street_number,
                    post_code : data.post_code,
                    city : data.city
                }).then((inserted) => {
                    let lastId = inserted.dataValues.id
                    User.CustomerModel.create({
                        id : lastId,
                        username : data.username,
                        password : Crypto.createHash('md5').update(data.password).digest('hex'),
                        id_Agency : data.id_Agency,
                        id_Employee : data.id_Employee,
                    }).then(inserted2 => inserted2)
                })
            )
        } else {
            return 'existing'
        }
    }

}