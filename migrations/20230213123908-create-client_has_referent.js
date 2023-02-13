'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('client_has_referent', {
      id: {
        primaryKey:true,
        allowNull:false,
        autoIncrement: true,
        type:Sequelize.INTEGER,
      },
      idClient:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'users'
          },
          key:'id'
        }
      },
      idEmployee:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'users'
          },
          key:'id'
        }
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('client_has_referent');
  }
};
