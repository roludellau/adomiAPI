'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('carer_has_availabilities', {
      id: {
        primaryKey:true,
        allowNull:false,
        autoIncrement: true,
        type:Sequelize.INTEGER,
      },
      idCarer:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'users'
          },
          key:'id'
        }
      },
      idAvailability:{
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'availabilities'
          },
          key:'id'
        }
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('carer_has_availabilities');
  }
};
