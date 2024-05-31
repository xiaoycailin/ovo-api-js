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
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = __importDefault(require("constants"));
const request_1 = __importDefault(require("./request"));
const { app_version, user_agent, os, os_ver, client_id, AGW_API } = require('../database/config');
const encryptRSA = (securityCode, deviceId, phoneNumber, otpRefId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const headers = {
        'App-Version': app_version,
        'User-Agent': user_agent,
        'OS': os,
        'OS-Version': os_ver,
        'client-id': client_id,
    };
    var d = new Date();
    var n = d.getTime();
    let currentTimeMillies = n;
    request_1.default.headers(headers);
    const RSA = yield request_1.default.get(AGW_API + '/v3/user/public_keys');
    let string = "LOGIN|" + securityCode + "|" + currentTimeMillies + "|" + deviceId + "|" + phoneNumber + "|" + deviceId + "|" + otpRefId;
    return crypto_1.default.publicEncrypt({
        "key": (_b = (_a = RSA.data) === null || _a === void 0 ? void 0 : _a.keys[0]) === null || _b === void 0 ? void 0 : _b.key,
        padding: constants_1.default.RSA_PKCS1_PADDING
    }, Buffer.from(string, "utf8")).toString("base64");
});
module.exports = {
    encryptRSA
};
