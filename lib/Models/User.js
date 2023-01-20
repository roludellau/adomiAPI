"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("../dbconfig/db.js");
const crypto_1 = __importDefault(require("crypto"));
class User {
    static queryTransaction(request, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield db_js_1.sequelize.transaction();
            try {
                return query(request);
            }
            catch (error) {
                yield t.rollback();
                throw error;
            }
        });
    }
    static getAllUsers() {
        return User.UserModel.findAll();
    }
    static addUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = request.query;
            let existingUser = yield User.UserModel.findOne({ where: { firstname: data.firstname, lastname: data.lastname } });
            if (!existingUser) {
                return (User.UserModel.create({
                    lastname: data.lastname,
                    firstname: data.firstname,
                    phone: data.phone,
                    mail: data.mail,
                    street_name: data.street_name,
                    street_number: data.street_number,
                    post_code: data.post_code,
                    city: data.city
                }).then((inserted) => {
                    let lastId = inserted.dataValues.id;
                    User.CustomerModel.create({
                        id: lastId,
                        username: data.username,
                        password: crypto_1.default.createHash('md5').update(data.password).digest('hex'),
                        id_Agency: data.id_Agency,
                        id_Employee: data.id_Employee,
                    }).then(inserted2 => inserted2);
                }));
            }
            else {
                return 'existing';
            }
        });
    }
}
exports.default = User;
_a = User;
User.UserModel = db_js_1.sequelize.define('user', {
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
User.CustomerModel = db_js_1.sequelize.define('customer', {
    id: {
        type: db_js_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    username: {
        type: db_js_1.DataTypes.STRING,
    },
    password: {
        type: db_js_1.DataTypes.STRING(1234),
    },
    id_Agency: {
        type: db_js_1.DataTypes.INTEGER,
    },
    id_Employee: {
        type: db_js_1.DataTypes.INTEGER,
    },
}, {
    tableName: 'customer'
});
(() => {
    _a.UserModel.hasOne(_a.CustomerModel);
    _a.CustomerModel.belongsTo(_a.UserModel, { foreignKey: 'id' });
})();
