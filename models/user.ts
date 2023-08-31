'use strict';
import {
  Model
} from 'sequelize';

export interface UserAttributes{
  first_name:string;
  last_name:string;
  email:string;
  password:string;
  user_name:string;
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
    first_name!:string;
    last_name!:string;
    email!:string;
    password!:string;
    user_name!:string;
    phone!:string;
    street_name!:string;
    street_number!:number;
    post_code!: string;
    city!:string;

    static associate(models: any) {
      // define association here
      User.belongsTo(models.User_Role, {
        as: 'role',
        foreignKey:'id_role',
      })
      User.belongsTo(models.Agency, {
        as: 'agency',
        foreignKey: 'id_agency'
      })

      User.belongsToMany(models.User,{
        as:'referent',
        through: 'client_has_referent'
        
      })
    }
  }
  User.init({
    first_name: {

        type: DataTypes.STRING,

        validate:{

          isAlpha: true, // on vérifie qu'il s'agit bien d'un string
          notEmpty: true, // valeur de champ vide non autorisée
          len: [2,50] // valeur du nom comprise entre 2 et 50 (ex.)

        }

    },
//tests avec messages personnalisés
    last_name: {

      type: DataTypes.STRING,

      validate:{
          
        isAlpha: {

          msg: "Veuillez indiquer une chaîne de caractères"
        },

        notEmpty: true, 
        len: {
          args:[2,50],
          msg: "Veuillez indiquer un nom d'un longueur comprise entre 2 et 50 caractères"
        }, 

      }

    },

    email:{

      type: DataTypes.STRING,
      // unique: true, 

      validate:{
        notEmpty: true,
        isEmail: true, 
        is:{
          //test regex
          args:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g],
          msg: "Veuillez entrer un email valide"

        }
      }
    },
    password: {
      type:DataTypes.STRING,

      validate:{

        notEmpty:{
          msg: "Veuillez indiquer un mot de passe"
        },

        min:{
          args:[5],
          msg: "Votre mot de passe doit contenir au minimum 5 caractères"
        }
        
      }

    },

    user_name: {

      type: DataTypes.STRING,
      unique:true, // à voir si c'est pertinent
      validate:{
        notEmpty:{
          msg: "Veuillez renseigner un nom d'utilisateur"
        }

      }
    } ,

    phone:{
      
      type:DataTypes.STRING(10),
      validate:{
        isNumeric:{
          msg:"Veuillez entrer une valeur numérique"
        },

        notEmpty:{
          msg:"Veuillez entrer un numéro de téléphone"
        },

        len:{
          args:[10, 10],
          msg:"Veuillez entrer un numéro à 10 chiffres"
        },

        is:{
          args: [/^0[0-9].*$/],
          msg: "Le numéro de téléphone doit commencer par 0"
        },
        // validPhone(value: any){

        //   let regExp = /^0[0-9].*$/

        //   if(!regExp.test(value)){

        //     throw new Error("Le numéro de téléphone doit commencer par 0");

        //     // return msg

        //   }

        // }
        
      }
    },
    street_name:{
      type: DataTypes.STRING,
    },

    street_number:{
      type: DataTypes.INTEGER,
      validate:{
        isNumeric:{
          msg:"Veuillez entrer une valeur numérique"
        }
      }
    },

    post_code:{
      type: DataTypes.STRING(5),
    },

    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
    tableName: 'users'
  });
  return User;
};