'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('client_has_referent', [
      {
        idClient: '1',    
        idEmployee: '2',
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('client_has_referent', null, {});

  }
};
