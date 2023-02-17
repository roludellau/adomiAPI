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
      Appointment.hasOne(models.User, {
        as: 'carer',
        foreignKey: 'idCarer'
      })
      Appointment.hasOne(models.Mission, {
        as: 'mission',
        foreignKey: 'id' //bizarrement dans ce type de relation, ça ne fonctionne pas si on entre ici le nom de champ de la clé étrangère (ex: idMission). Il faut mettre le nom de champ de la table à laquelle on se réfère.
      })
    }
  }
  Appointment.init({
    date: DataTypes.DATE,
    startHour: DataTypes.TIME,
    endHour: DataTypes.TIME,
    streetName: DataTypes.STRING,
    streetNumber: DataTypes.INTEGER,
    postCode: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments'
  });
  return Appointment;
};