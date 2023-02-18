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

    await queryInterface.addConstraint('carer_has_availabilities', {
      fields: ['idAvailability'],
      type: 'foreign key',
      name:'fk_availability',
      onDelete: 'CASCADE',
      references: {
        table: 'availabilities',
        field: 'id'
      },
    })

    await queryInterface.addConstraint('carer_has_availabilities', {
      fields: ['idCarer'],
      type: 'foreign key',
      name:'fk_carer',
      onDelete: 'CASCADE',
      references: {
        table: 'users',
        field: 'id'
      },
    })

  },


  async down (queryInterface, Sequelize) {
    //queryInterface.removeConstraint('carer_has_availabilities', 'fk_availability')
    //queryInterface.removeConstraint('carer_has_availabilities', 'carer_has_availabilities_fk_carer')  
    await queryInterface.dropTable('carer_has_availabilities');
  }

};
