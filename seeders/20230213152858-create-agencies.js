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
      {
        name: 'Agence des pies',    
        adress: '13 avenue du Faucon',
      },


  ], {});

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('agencies', null, {});

  }
};
