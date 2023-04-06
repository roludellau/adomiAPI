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
        foreignKey: 'id_carer'
      })
      Appointment.belongsTo(models.Mission, {
        as: 'mission',
        foreignKey: 'idMission'
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
    tableName: 'appointments',
    timestamps: false
  });
  return Appointment;
};