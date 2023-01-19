'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface , Sequelize ) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model:{
            tableName: 'users'
          },
          key:'id'
        }
      },
      customerID: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers');
  }
};