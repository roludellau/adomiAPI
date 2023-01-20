"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("../dbconfig/db.js");
const User_1 = __importDefault(require("../../adomiAPI/src/Models/User"));
class Caresr extends User_1.default {
}
exports.default = Caresr;
_a = Caresr;
Caresr.CarerModel = db_js_1.sequelize.define('carer', {
    id: {
        type: db_js_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    perimeter: {
        type: db_js_1.DataTypes.INTEGER,
    },
    id_appointment: {
        type: db_js_1.DataTypes.INTEGER,
    },
}, {
    tableName: 'carer'
});
(() => {
    _a.UserModel.hasOne(_a.CarerModel);
    _a.CarerModel.belongsTo(_a.UserModel, { foreignKey: 'id' });
})();
