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
        idCarer: 3,
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
/** */
      {
        startDate: '2023-08-24 00:00:00',
        startHour: '13:30:00',
        endHour: '16:30:00',
        streetName: null,
        streetNumber: null,
        postCode: null,
        city: null,
        validated: false,
        idClient: 1,
        idEmployee: 5,
        idCarer: 8,
        idRecurence: 1
      },
      {
        startDate: '2023-08-30 00:00:00',
        startHour: '10:00:00',
        endHour: '12:00:00',
        streetName: null,
        streetNumber: null,
        postCode: null,
        city: null,
        validated: true,
        idClient: 9,
        idEmployee: 10,
        idCarer: 11,
        idRecurence: 1
      },
      {
        startDate: '2023-09-08 00:00:00',
        startHour: '16:45:00',
        endHour: '19:30:00',
        streetName: "Baker street",
        streetNumber: 83,
        postCode: 118218,
        city: "Simpe et Tessebour sur Loire",
        validated: false,
        idClient: 9,
        idEmployee: 10,
        idCarer: 11,
        idRecurence: 2
      },
      {
        startDate: '2023-09-15 00:00:00',
        startHour: '14:00:00',
        endHour: '15:30:00',
        streetName: null,
        streetNumber: null,
        postCode: null,
        city: null,
        validated: false,
        idClient: 4,
        idEmployee: 5,
        idCarer: 6,
        idRecurence: 3
      },



  ]);
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('missions', null, {});
     
  }
};
