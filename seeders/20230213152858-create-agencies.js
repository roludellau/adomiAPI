'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('agencies', [
      {
        name: 'Agence des rossignols',    
        adress: '1 rue de la garenne',
      },
      {
        name: 'Agence des colombes',    
        adress: '97 boulevard de la buse',
      },

  ], {});

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('agencies', null, {});

  }
};
