'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('missions', [
      {
        startDate: '2023-02-13 00:00:00',
        startHour: '14:00:00',
        endHour: '15:00:00',
        streetName: null,
        streetNumber: null,
        postCode: null,
        city: null,
        validated: true,
        idClient: 1,
        idEmployee: 2,
        idCarer: 3 	,
        idRecurence: 1
      },
      {
        startDate: '2023-03-15 00:00:00',
        startHour: '16:00:00',
        endHour: '17:00:00',
        streetName: null,
        streetNumber: null,
        postCode: null,
        city: null,
        validated: true,
        idClient: 1,
        idEmployee: 2,
        idCarer: 3,
        idRecurence: 2
      },

  ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
