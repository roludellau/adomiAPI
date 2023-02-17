'use strict';
import {
  Model
} from 'sequelize';

interface UserAttributes{
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  userName:string;
  phone:string;
  street_name:string;
  street_number:number;
  post_code: string;
  city:string;
}
module.exports = (sequelize: any, DataTypes:any ) => {
  class User extends Model<UserAttributes> 
  implements UserAttributes{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    firstName!:string;
    lastName!:string;
    email!:string;
    password!:string;
    userName!:string;
    phone!:string;
    street_name!:string;
    street_number!:number;
    post_code!: string;
    city!:string;

    static associate(models: any) {
      // define association here
      User.belongsTo(models.User_Role, {
        as: 'role',
        foreignKey:'idRole',
      })
      User.belongsTo(models.Agency, {
        as: 'agency',
        foreignKey: 'idAgency'
      })

      User.belongsToMany(models.User,{
        as:'referent',
        through: 'client_has_referent'
        
      })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userName: DataTypes.STRING,
    phone: DataTypes.STRING(10),
    street_name: DataTypes.STRING,
    street_number: DataTypes.INTEGER,
    post_code: DataTypes.STRING(5),
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false

  });
  return User;
};