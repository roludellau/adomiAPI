export {}
'use strict';
const {
  Model
} = require('sequelize');




module.exports = (sequelize: any, DataTypes: { INTEGER: any; DATE: any; TIME: any; STRING: any; BOOLEAN: any; }) => {
  class Mission extends Model {

    id!: number
    startDate!: string
    startHour!: string
    endHour!: string
    streetName!: string
    streetNumber!: number
    postCode!: string
    city!: string
    validated!: boolean

    static associate(models: any) {
      Mission.HasOne(models.Recurence, {
        as: 'recurence'
      })
    }
  }


  Mission.init({
    id: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    startHour: DataTypes.TIME,
    endHour: DataTypes.TIME,
    streetName: DataTypes.STRING,
    streetNumber: DataTypes.INTEGER,
    postCode: DataTypes.STRING,
    city: DataTypes.STRING,
    validated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Mission',
  });
  return Mission;
};