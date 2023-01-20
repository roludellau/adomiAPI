'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    queryInterface.addConstraint('Users', {
      fields: ['roleId'],
      type: 'foreign key',
      name:'user-role-association',
      references: {
        table: 'User_Roles',
        field: 'id'
      }
    })
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
