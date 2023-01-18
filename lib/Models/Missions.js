"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("../dbconfig/db.js");
const Core_1 = __importDefault(require("./Core"));
class Mission extends Core_1.default {
}
exports.default = Mission;
Mission.MissionModel = db_js_1.sequelize.define('mission', {
    id: {
        type: db_js_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    lastname: {
        type: db_js_1.DataTypes.STRING,
    },
    firstname: {
        type: db_js_1.DataTypes.STRING,
    },
    username: {
        type: db_js_1.DataTypes.STRING,
    },
    password: {
        type: db_js_1.DataTypes.STRING(1234),
    },
    phone: {
        type: db_js_1.DataTypes.INTEGER,
    },
    mail: {
        type: db_js_1.DataTypes.STRING(1234),
    },
    street_name: {
        type: db_js_1.DataTypes.STRING,
    },
    street_number: {
        type: db_js_1.DataTypes.STRING,
    },
    post_code: {
        type: db_js_1.DataTypes.STRING,
    },
    city: {
        type: db_js_1.DataTypes.STRING,
    }
}, {
    tableName: 'user'
});
