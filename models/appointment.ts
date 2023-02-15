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
        as: 'carer'
      })
      Appointment.hasOne(models.Mission, {
        as: 'mission'
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