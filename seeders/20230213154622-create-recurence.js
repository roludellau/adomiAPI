'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('recurences', [
      {
        recurence_type: 'weekly',    
      },
      {
        recurence_type: 'monthly',    
      },
      {
        recurence_type: 'bi-monthly',    
      },
    ])

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
