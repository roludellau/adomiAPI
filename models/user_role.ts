'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize: any, DataTypes: { STRING: any; }) => {
  class User_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      User_Role.hasMany(models.User, {
        as: 'role',
        foreignKey:'id_role',
      })

    }
  }
  User_Role.init({
    label: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_Role',
    tableName: 'user_roles',
    timestamps: false
  });
  return User_Role;
};