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
    start_date: {
        type: db_js_1.DataTypes.DATE,
    },
    start_hour: {
        type: db_js_1.DataTypes.DATE,
    },
    end_hour: {
        type: db_js_1.DataTypes.DATE,
    },
    street_name: {
        type: db_js_1.DataTypes.STRING,
    },
    street_number: {
        type: db_js_1.DataTypes.INTEGER,
    },
    post_code: {
        type: db_js_1.DataTypes.STRING,
    },
    city: {
        type: db_js_1.DataTypes.STRING,
    },
    validated: {
        type: db_js_1.DataTypes.BOOLEAN,
    },
    id_Carer: {
        type: db_js_1.DataTypes.INTEGER,
    },
    id_Customer: {
        type: db_js_1.DataTypes.INTEGER,
    },
    id_Employee: {
        type: db_js_1.DataTypes.INTEGER,
    },
    id_Recurence: {
        type: db_js_1.DataTypes.INTEGER,
    }
});
