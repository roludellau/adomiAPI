'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('availabilities', 
    [
      {
        week_day: '1',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
      {
        week_day: '1',
        start_hour: '10:00:00',
        end_hour: '11:30:00',
      },
      {
        week_day: '3',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
      {
        week_day: '3',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
      {
        week_day: '4',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
      {
        week_day: '4',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
      {
        week_day: '5',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
      {
        week_day: '5',
        start_hour: '12:30:00',
        end_hour: '17:45:00',
      },
    ]
  )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('availabilities', null, {});

  }
};
