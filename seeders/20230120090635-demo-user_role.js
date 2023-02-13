'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_roles', [{
        libelle: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
  
     },
    {
      libelle: 'employe',
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      libelle: 'carer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});

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
