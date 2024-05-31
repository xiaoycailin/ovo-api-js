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
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const ResponseError_1 = __importDefault(require("../error/ResponseError"));
const Enum_1 = require("../interface/Enum");
class ovo_user {
    static find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default.getConnection();
            try {
                let queryString = "SELECT * FROM ovo_users";
                const queryParams = [];
                if (query === null || query === void 0 ? void 0 : query.where) {
                    const whereClauses = Object.entries(query.where).map(([key, value]) => {
                        queryParams.push(value);
                        return `${key} = ?`;
                    });
                    if (whereClauses.length > 0) {
                        queryString += " WHERE " + whereClauses.join(" AND ");
                    }
                }
                const user = yield connection.query(queryString, queryParams);
                const user0 = user[0];
                if (user0.length === 0)
                    throw new ResponseError_1.default(Enum_1.ResponseCode.NOT_FOUND, 'No User Found');
                return user0;
            }
            finally {
                connection.release();
            }
        });
    }
    static findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default.getConnection();
            try {
                let queryString = "SELECT * FROM ovo_users";
                const queryParams = [];
                if (query === null || query === void 0 ? void 0 : query.where) {
                    const whereClauses = Object.entries(query === null || query === void 0 ? void 0 : query.where).map(([key, value]) => {
                        queryParams.push(value);
                        return `${key} = ?`;
                    });
                    if (whereClauses.length > 0) {
                        queryString += " WHERE " + whereClauses.join(" AND ");
                    }
                }
                const user = yield connection.query(queryString, queryParams);
                const user0 = user[0];
                if (user0.length === 0)
                    throw new ResponseError_1.default(Enum_1.ResponseCode.NOT_FOUND, 'No User Found');
                return user0[0];
            }
            finally {
                connection.release();
            }
        });
    }
    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default.getConnection();
            try {
                if (userData) {
                    let results = [];
                    const insertData = Array.isArray(userData) ? userData : [userData];
                    const allQueryParams = [];
                    let queryString = "INSERT INTO ovo_users (";
                    if (insertData.length > 0) {
                        const keys = Object.keys(insertData[0]).filter(key => ['username', 'apikey', 'phone_number', 'access_token', 'pin'].includes(key));
                        queryString += keys.join(', ') + ") VALUES ";
                        insertData.forEach((data, index) => {
                            const placeholders = keys.map(() => '?').join(', ');
                            queryString += (index > 0 ? ", " : "") + `(${placeholders})`;
                            const queryParams = keys.map(key => data[key]);
                            allQueryParams.push(...queryParams);
                        });
                    }
                    const result = yield connection.query(queryString, allQueryParams);
                    results.push(result);
                    const response = results[0][0];
                    if (response)
                        return response;
                    throw new Error('No data created');
                }
            }
            finally {
                connection.release();
            }
        });
    }
    static update(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield connection_1.default.getConnection();
            try {
                if (query.update && query.where) {
                    let queryString = "UPDATE ovo_users SET ";
                    const updateKeys = Object.keys(query.update);
                    const updateValues = updateKeys.map(key => query.update[key]);
                    const setClauses = updateKeys.map(key => `${key} = ?`).join(', ');
                    queryString += setClauses;
                    const whereKeys = Object.keys(query.where);
                    const whereValues = whereKeys.map(key => query.where[key]);
                    const whereClauses = whereKeys.map(key => `${key} = ?`).join(' AND ');
                    if (whereClauses.length > 0) {
                        queryString += " WHERE " + whereClauses;
                    }
                    const queryParams = [...updateValues, ...whereValues];
                    const result = yield connection.query(queryString, queryParams);
                    const affectedRows = result.affectedRows;
                    if (affectedRows === 0) {
                        throw new ResponseError_1.default(Enum_1.ResponseCode.NOT_FOUND, 'Tidak ada Pengguna yang diperbarui');
                    }
                    return { message: 'Pengguna berhasil diperbarui', affectedRows };
                }
                else {
                    throw new ResponseError_1.default(Enum_1.ResponseCode.BAD_REQUEST, 'Data pembaruan atau kondisi tidak valid');
                }
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.default = ovo_user;
