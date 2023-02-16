export {}
'use strict';
const {
  Model
} = require('sequelize');




module.exports = (sequelize: any, DataTypes: { INTEGER: any; DATE: any; TIME: any; STRING: any; BOOLEAN: any; }) => {
  class Mission extends Model {

    startDate!: string
    startHour!: string
    endHour!: string
    streetName!: string
    streetNumber!: number
    postCode!: string
    city!: string
    validated!: boolean

    static associate(models: any) {

      Mission.hasOne(models.Recurence, {
        as: 'recurence'
      })

      Mission.belongsTo(models.User, {
        as: 'carer',
        foreignKey: 'idCarer'
      })
    }
  }


  Mission.init({
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
    tableName: 'missions'
  });
  return Mission;
};