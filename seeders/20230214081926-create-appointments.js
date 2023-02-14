'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('appointments', [
      {
        date: '2023-02-14 11:00:00',
        startHour: '14:00:00',
        endHour: '15:00:00' ,
        streetName: 'Rue Jean Jaures',
        streetNumber: 2,
        postCode: '78000',
        city:'Versailles',
        idCarer: 3,
        idMission: 1
      },
      {
        date: '2023-02-21 11:00:00',
        startHour: '16:00:00',
        endHour: '17:00:00' ,
        streetName: 'rue Albert Camus',
        streetNumber: 25,
        postCode: '78000',
        city:'Versailles',
        idCarer: 3,
        idMission: 2
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('appointments', null, {});

  }
};
