export {}
'use strict';
const {
  Model
} = require('sequelize');

interface recurenceAttributes {
  recurenceType: string 
}

module.exports = (sequelize: any, DataTypes: { INTEGER: any; STRING: any; }) => {
  class Recurence extends Model<recurenceAttributes> 

    implements recurenceAttributes {

      recurenceType!: string

    static associate(models: any) {
      // define association here
    }


  }
  Recurence.init({
    recurence_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Recurence',
  });
  return Recurence;
};