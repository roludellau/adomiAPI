'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('user_agency',{
      idUser:{
        primaryKey:true,
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'users'
          },
          key:'id'
        }
      },
      idAgency:{
        primaryKey:true,
        allowNull:false,
        type:Sequelize.INTEGER,
        references:{
          model:{
            tableName:'agencies'
          },
          key:'id'
        }
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
    await queryInterface.dropTable('user_agency');
  }
};
