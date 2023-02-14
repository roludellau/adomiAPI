'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('missions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      startHour: {
        type: Sequelize.TIME
      },
      endHour: {
        type: Sequelize.TIME
      },
      streetName: {
        type: Sequelize.STRING
      },
      streetNumber: {
        type: Sequelize.INTEGER
      },
      postCode: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      validated: {
        type: Sequelize.BOOLEAN
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
      idCarer:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'users'
          },
          key:'id'
        }
      },
      idRecurence:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'recurences'
          },
          key:'id'
        }
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('missions');
  }
};