'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_agencies',{
      idUser:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'users'
          },
          key:'id'
        }
      },
      idAgency:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'agencies'
          },
          key:'id'
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_agencies');
  }
};