'use strict';
import {
  HasMany,
  Model
} from 'sequelize';

interface availabilitiesAttributes{
  week_day:number,
  start_hour:Date,
  end_hour:Date
}
module.exports = (sequelize: any, DataTypes: { NUMBER: any; TIME: any; }) => {
  class Availability extends Model<availabilitiesAttributes>
  implements availabilitiesAttributes{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    week_day!: number;
    start_hour!:Date;
    end_hour!:Date;

    static associate(models: any) {
      Availability.belongsToMany(models.User, { 
        through: 'carer_has_availabilities',
        foreignKey: 'idCarer'
      })
    }

  }
  Availability.init({
    week_day: DataTypes.NUMBER,
    start_hour: DataTypes.TIME,
    end_hour: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Availability',
    tableName: 'availabilities'
  });
  return Availability;
};