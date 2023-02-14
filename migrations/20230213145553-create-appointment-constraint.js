'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('appointments', {
      fields: ['idCarer'],
      type: 'foreign key',
      name:'appointment-carer-association',
      references: {
        table: 'users',
        field: 'id'
      }
    })

    queryInterface.addConstraint('appointments', {
      fields: ['idMission'],
      type: 'foreign key',
      name:'user-mission-association',
      references: {
        table: 'missions',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('appointments', 'appointment-carer-association')
    queryInterface.removeConstraint('appointments', 'user-mission-association')
}
};
