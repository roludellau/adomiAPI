"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypes = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "DataTypes", { enumerable: true, get: function () { return sequelize_1.DataTypes; } });
const sequelize = new sequelize_1.Sequelize('a_do_mi', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: "mysql",
    define: {
        timestamps: false,
        freezeTableName: true
    }
});
exports.sequelize = sequelize;
