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
  id_role: number;
  id_agency: number
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
    id_role!: number;
    id_agency!: number

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
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: { msg: "Le champs first_name n'a pas été fourni" },
          notEmpty: { msg: "Veuillez entrer une valeur" },
          len: { args: [1,255], msg: "Veuillez entrer un prénom contenant entre 1 et 255 lettres"}
        }
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: { msg: "Le champs last_name n'a pas été fourni" },
        notEmpty: { msg: "Veuillez entrer une valeur" },
        len: { args: [1,255], msg: "Veuillez entrer un nom contenant entre 1 et 255 lettres"}
      }
    },

    email:{
      type: DataTypes.STRING,
      unique: { name: "email", msg: "Un compte est déjà associé à cette adresse mail"}, 
      allowNull: false,
      validate: {
        notNull: { msg: "Le champs email n'a pas été fourni" },
        notEmpty: { msg: "Veuillez entrer une valeur" },
        isEmail: { msg: "Veuillez entrer un email valide" }, 
        is:{
          //test regex
          args:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g],
          msg: "Veuillez entrer un email valide"
        }
      }
    },

    
    password: {
      type:DataTypes.STRING,
      //La validation de password doit se faire avant le hash
      allowNull: false,
      validate:{
        notNull: { msg: "Le champs password n'a pas été fourni" },
        /*
        min: {
          args:[8],
          msg: "Votre mot de passe doit contenir au minimum 8 caractères"
        },
        is: {
          args:[/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&µ£\/\\~|\-])[\wÀ-ÖØ-öø-ÿ@$!%*#?&µ£~|\-]{8,255}$/],
          msg: "Votre mot de passe doit contenir une lettre, un chiffre, un caractère spécial, et faire au moins 8 caractères"
        }
        */
      }
      
    },
  


    user_name: {
      type: DataTypes.STRING,
      unique: {name: "user_name", msg: "Un compte possède déjà ce nom d'utilisateur"},
      allowNull: false,
      validate: {
        notNull: { msg: "Le champs user_name n'a pas été fourni" },
        len: { args: [3,255], msg: "Veuillez entrer un nom d'utilisateur contenant entre 1 et 255 lettres"}
      }
    },

    phone:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: { msg: "Le champs phone n'a pas été fourni" },
        isNumeric:{ msg:"Veuillez entrer une valeur numérique" },
        len:{ args:[10, 10], msg:"Veuillez entrer un numéro à 10 chiffres" },
        is:{ args: [/^0[0-9].*$/], msg: "Le numéro de téléphone doit commencer par 0" },
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
      allowNull: false,
      validate: {
        notNull: { msg: "Le champs street_name n'a pas été fourni" },
        notEmpty:{ msg:"Veuillez entrer un nom de rue" },
        len:{ args:[1, 255], msg:"Veuillez entrer une valeur entre 1 et 255 caractères" },
      }
    },

    street_number:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notNull: { msg: "Le champs street_number n'a pas été fourni" },
        isNumeric:{ msg:"Veuillez entrer une valeur numérique" },
        len:{ args:[1, 255], msg:"Veuillez entrer une valeur entre 1 et 255 caractères" },
      }
    },

    post_code:{
      type: DataTypes.STRING,        
      allowNull: false,
      validate: {
        notNull: {msg: "Le champs post_code n'a pas été fourni"},
        isNumeric:{ msg:"Veuillez entrer une valeur numérique" },
        notEmpty:{ msg:"Veuillez entrer un code postal" },
        len:{ args:[5, 5], msg:"Veuillez entrer une code postal à 5 caractères" },
      }
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Le champs city n'a pas été fourni" },
        len:{ args:[1, 255], msg:"Veuillez entrer une valeur entre 1 et 255 caractères" },
      }
    },

    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Le champs id_role n'a pas été fourni" },
        isNumeric:{ msg:"Veuillez entrer une valeur numérique" },
        notEmpty:{ msg:"Veuillez entrer un id de role" },
      }
    },

    id_agency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Le champs id_agency n'a pas été fourni" },
        isNumeric:{ msg:"Veuillez entrer une valeur numérique" },
        notEmpty:{ msg:"Veuillez entrer un id d'agence" },
      }
    },
  }, 

  {
    sequelize,
    modelName: 'User',
    timestamps: false,
    tableName: 'users'
  });

  return User;
};