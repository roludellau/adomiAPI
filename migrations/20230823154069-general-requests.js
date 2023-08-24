'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('general_requests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            request_string: {
                allowNull: false,
                type: Sequelize.STRING(255)
            },
            user_id: {
                allowNull:true,
                type:Sequelize.INTEGER,
                references: {
                    model: {
                        tableName:'users'
                    },
                    key:'id'
                }
            },
            referrer_id: {
                allowNull:true,
                type:Sequelize.INTEGER,
                references: {
                    model: {
                        tableName:'users'
                    },
                    key:'id'
                }
            },
            done: {
                allowNull: false,
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            created_at: {
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                type: Sequelize.DATE
            },
        });
    },


    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('general_requests');
    }

}