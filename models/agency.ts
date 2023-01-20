'use strict';
import {
  Model
} from 'sequelize';

interface agencyAttributes {
  name:string,
  adress:string
}
module.exports = (sequelize: any, DataTypes: { STRING: any; }) => {
  class Agency extends Model<agencyAttributes>
  implements agencyAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    name!:string;
    adress!:string;
    static associate(models: any) {
      // define association here

      Agency.belongsToMany(models.User, {through:'Agency_employee'})
    }
  }
  Agency.init({
    name: DataTypes.STRING,
    adress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Agency',
  });
  return Agency;
};