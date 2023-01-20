'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface , Sequelize ) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        onDelete:'CASCADE',
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING(10)
      },
      street_name: {
        type: Sequelize.STRING
      },
      street_number: {
        type: Sequelize.INTEGER
      },
      post_code: {
        type: Sequelize.STRING(5)
      },
      city: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Users');
  }
};