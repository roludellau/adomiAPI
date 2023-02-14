'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_roles', [
      {
        label: 'customer',    
      },
      {
        label: 'employee',
      }, 
      {
        label: 'carer',
      },
  ], {});

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user_roles', null, {});

  }
};
