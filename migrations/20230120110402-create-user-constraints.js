'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    queryInterface.addConstraint('users', {
      fields: ['idRole'],
      type: 'foreign key',
      name:'user-role-association',
      references: {
        table: 'user_roles',
        field: 'id'
      }
    })

    queryInterface.addConstraint('users', {
      fields: ['idAgency'],
      type: 'foreign key',
      name:'user-agency-association',
      references: {
        table: 'agencies',
        field: 'id'
      }
    })
    
  },

  async down (queryInterface, Sequelize) {
      queryInterface.removeConstraint('users', 'user-role-association')
      queryInterface.removeConstraint('users', 'user-agency-association')

  }
};
