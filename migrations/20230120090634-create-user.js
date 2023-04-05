'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface , Sequelize ) {
    await queryInterface.createTable('users', {
                  
      //Tous les champs sont désormais en snake_case

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        onDelete:'CASCADE',
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      street_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      street_number: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      post_code: {
        allowNull: false,
        type: Sequelize.STRING(5)
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_role: {
        allowNull:false,
        type:Sequelize.INTEGER,
      },
      id_agency: {
        allowNull:false,
        type:Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};