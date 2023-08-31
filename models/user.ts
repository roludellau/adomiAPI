'use strict';
import { Model } from 'sequelize';

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

    class User extends Model<UserAttributes> implements UserAttributes {
                            
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
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true,
                is: {
                  args: /^[A-Za-zÀ-ÖØ-öø-ÿ\-\s]+$/i, // RegEx pour caractères aplhabétiques avec accents, et tirets "-"
                  msg: "Le prénom saisi comporte des caractères non supportés"
              },
              len: {
                    args:[2,50],
                    msg: "Veuillez indiquer un nom d'un longueur comprise entre 2 et 50 caractères"
                },
            }
        },

        last_name: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true,
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ\-\s]+$/i, // RegEx pour caractères aplhabétiques avec accents, et tirets "-"
                    msg: "Le nom de famille saisi comporte des caractères non supportés"
                },
                len: {
                    args:[2,50],
                    msg: "Veuillez indiquer un nom d'un longueur comprise entre 2 et 50 caractères"
                }, 
            }
        },

        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true, 
            validate:{
                notNull: true,
                notEmpty: true,
                isEmail: true, 
            }
        },

        password: {
            type:DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: true,
              notEmpty: {
                  msg: "Veuillez indiquer un mot de passe"
              },
            }
        },

        user_name: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true,
                is: {
                    args: /^[a-z]{1,50}[.][a-z]{1,50}$/, // RegEx pour prenom.nomdefamille
                    msg: "Le nom d'utilisateur doit être sous ce format: prenom.nomdefamille (sans accents ou quoi)"
                },
                len: {
                    args:[3,100],
                    msg: "Veuillez indiquer un nom d'un longueur comprise entre 3 et 100 caractères"
                },
            }
        },

        phone: {
            type:DataTypes.STRING(10),
            validate: {
                notEmpty: {
                    msg: "Veuillez entrer un numéro de téléphone"
                },
                len: {
                    args: [10, 10],
                    msg: "Veuillez entrer un numéro à 10 chiffres"
                },
                is: {
                    args: [/^0[0-9].*$/],
                    msg: "Le numéro de téléphone doit être numérique, et commencer par 0"
                },
            }
        },


        street_name:{
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ\-\s]+$/i, // RegEx pour caractères aplhabétiques avec accents, espaces, et tirets "-"
                    msg: "Veuillez indiquer un nom de rue valide (seulement des lettres et des tirets)"
                },
                len: {
                    args:[5, 150],
                    msg: "Veuillez indiquer un nom de rue de moins de 150 caractères"
                }, 
            }
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
            validate: {
                len: {
                    args:[5, 5],
                    msg: "Le code postal doit faire 5 chiffres"
                },
            }
        },

        city: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args:[1, 150],
                    msg: "La ville doit faire moins de 150 caractères"
                },
            }
        }
    },
  
    {
      sequelize,
      modelName: 'User',
      timestamps: false,
      tableName: 'users'
    }
  )

  return User;
};