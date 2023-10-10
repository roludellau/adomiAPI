export {}
'use strict';
const {
  Model
} = require('sequelize');


export type MissionInterface = {
    id?: string
    startDate: string
    startHour: string
    endHour: string
    streetName: string
    streetNumber: number
    postCode: string
    city: string
    validated: boolean
    recurence?: {
      recurence_type: string 
    }
}

module.exports = (sequelize: any, DataTypes: { INTEGER: any; DATE: any; TIME: any; STRING: any; BOOLEAN: any; }) => {

  class Mission extends Model implements MissionInterface {

    startDate!: string
    startHour!: string
    endHour!: string
    streetName!: string
    streetNumber!: number
    postCode!: string
    city!: string
    validated!: boolean

    static associate(models: any) {

      Mission.belongsTo(models.Recurence, {
        as: 'recurence',
        foreignKey: 'idRecurence'
      })

      Mission.belongsTo(models.User, {
        as: 'carer',
        foreignKey: 'idCarer'
      })

      Mission.belongsTo(models.User, {
        as: 'client',
        foreignKey: 'idClient'
      })
      Mission.belongsTo(models.User, {
        as: 'employee',
        foreignKey: 'idEmployee'
      })
    }
  }


  Mission.init({
    
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate:{

        isDate: true,
        notNull: {
          msg: "Veuillez renseigner une date"
        }

      }
    },

    startHour: {

      type: DataTypes.TIME,
      allowNull: false,
      // validate:{

      //   isNumeric: true,
      //   notNull: {
      //     msg: "Veuillez inidquer l'heure de début"
      //   }
      // }
    }, 
    
    endHour: {
      type: DataTypes.TIME,
      allowNull: false,

      // validate:{
      //   isNumeric: true,
      //   notNull: {
      //     msg: "Veuillez inidquer l'heure de fin"
      //   }
      // }
    },

    streetName: {

      type: DataTypes.STRING,
      allowNull: false,

      // validate:{
      //   isAlpha:{
      //     msg: "Veuillez indiquer un nom de rue valide"
      //   },
      //   notNull: {
      //     msg: "Veuillez renseigner un nom de rue"
      //   },
      // }
    },
    streetNumber:{

      type:  DataTypes.INTEGER,
      allowNull: false, 

      validate:{
      isNumeric: {
          msg: "Indiquer un numéro valide",
        },
        notNull: {
          msg: "Veuillez renseigner un numéro de rue"
        },
      }
    },

    postCode: {
      
      type: DataTypes.STRING,
      allowNull: false,

      validate:{

        isNumeric: {
          msg: "Indiquer un code postal valide"
        },
        len:{
          args:[5, 5],
          msg: "Code postal à 5 chiffres !"
        }
      }

    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,

      validate:{
        
        notNull: {
          msg: "Veuillez indiquer une ville"
        }
      }
    },
    validated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Mission',
    tableName: 'missions',
    timestamps: false,
  });
  return Mission;
};