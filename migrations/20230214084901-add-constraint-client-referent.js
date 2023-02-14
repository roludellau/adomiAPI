'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('client_has_referent', {
      fields: ['idClient'],
      type: 'foreign key',
      name:'client-has-referent',
      references: {
        table: 'users',
        field: 'id'
      }
    })

    queryInterface.addConstraint('client_has_referent', {
      fields: ['idEmployee'],
      type: 'foreign key',
      name:'employee-has-client',
      references: {
        table: 'users',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('client_has_referent', 'client-has-referent')
    queryInterface.removeConstraint('client_has_referent', 'employee-has-client')
  }
};
