'use strict';
/** @type {import('sequelize-cli').Migration} */
// import { DataTypes } from '@sequelize/core';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('availabilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      week_day: {
        type: Sequelize.INTEGER
      },
      start_hour: {
        type: Sequelize.TIME
      },
      end_hour: {
        type: Sequelize.TIME
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('availabilities');
  }
};