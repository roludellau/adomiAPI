'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
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
      idCarer: {
        type: Sequelize.INTEGER
      },
      idMission: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('appointments');
  }
};