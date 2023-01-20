'use strict';

import {
  Model
} from 'sequelize';

interface CustomerAttributes{
  customerID:number;
}

module.exports = (sequelize:any , DataTypes:any) => {
  class Customer extends Model<CustomerAttributes> 
  implements CustomerAttributes{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    customerID!:number;

    static associate(models:any) {
      // define association here
      models.User.hasOne(Customer)
      Customer.belongsTo(models.User)
    }
  }
  Customer.init({
    customerID: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};