'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('carer_has_availabilities', 
    [
      {
        idCarer: '3',
        idAvailability: '1',
      },
    ]
  )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carer_has_availabilities', null, {});

  }
};
