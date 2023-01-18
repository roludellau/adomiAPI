import { Sequelize, DataTypes} from 'sequelize'

const sequelize = new Sequelize('a_do_mi', 'root', '', {
    host: 'localhost',
    port: 3306, //port mysql
    dialect:"mysql",
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

export {sequelize, DataTypes}
