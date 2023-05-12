export {}
// Import the built-in data types
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize: any, DataTypes: { DATE: any; TIME: any; STRING: any; INTEGER: any; }) => {

  class Appointment extends Model {
    
    date!: string
    startHour!: string
    endHour!: string 
    streetName!: string
    streetNumber!: number
    postCode!: string
    city!:string
    
    static associate(models: any) {
      Appointment.belongsTo(models.User, {
        as: 'carer',
        foreignKey: 'idCarer'
      })
      Appointment.belongsTo(models.Mission, {
        as: 'mission',
        foreignKey: 'idMission'
      })
    }
  }
  Appointment.init({
    date: {
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
      validate:{

        isNumeric: true,
        notNull: {
          msg: "Veuillez inidquer l'heure de début"
        }
      }
    }, 
    
    endHour: {
      type: DataTypes.TIME,
      allowNull: false,

      validate:{
        isNumeric: true,
        notNull: {
          msg: "Veuillez inidquer l'heure de fin"
        }
      }
    },

    streetName: {

      type: DataTypes.STRING,
      allowNull: false,

      validate:{
        isAlpha:{
          msg: "Veuillez indiquer un nom de rue valide"
        },
        notNull: {
          msg: "Veuillez renseigner un nom de rue"
        },
      }
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
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    timestamps: false
  });
  return Appointment;
};