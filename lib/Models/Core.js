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
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("../dbconfig/db.js");
class Core {
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
}
exports.default = Core;
