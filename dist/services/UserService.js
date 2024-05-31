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
const User_1 = __importDefault(require("../model/User"));
const ResponseError_1 = __importDefault(require("../error/ResponseError"));
const ResponseCode_1 = require("../interface/Enum/ResponseCode");
const ResponseMessage_1 = require("../interface/Enum/ResponseMessage");
class UserService {
    static get pin() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.pin;
    }
    static get apikey() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.apikey;
    }
    static get access_token() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.access_token;
    }
    static get phone_number() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.phone_number;
    }
    static get id() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.id;
    }
    static get otp_ref_id() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.otp_ref_id;
    }
    static get otp_token() {
        var _a;
        return (_a = this.userData) === null || _a === void 0 ? void 0 : _a.otp_token;
    }
    static get data() {
        return this.userData;
    }
    static authorized(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                apikey: null
            };
            // Check if x-apikey header exists and is not empty
            if (req.headers['x-apikey'] && req.headers['x-apikey'] !== '') {
                query.apikey = req.headers['x-apikey'];
            }
            else if (req.method === 'GET') {
                // If x-apikey header does not exist and method is GET, use query parameter
                query.apikey = req.query.apikey;
            }
            else if (req.method === 'POST') {
                // If x-apikey header does not exist and method is POST, use body parameter
                query.apikey = req.body.apikey;
            }
            else {
                // If none of the above conditions are met, throw method not allowed error
                throw new ResponseError_1.default(ResponseCode_1.ResponseCode.METHOD_NOT_ALLOWED, ResponseMessage_1.ResponseMessage.METHOD_NOT_ALLOWED);
            }
            // If apikey is still null or undefined, throw unauthorized error
            if (!query.apikey) {
                throw new ResponseError_1.default(ResponseCode_1.ResponseCode.UNAUTHORIZED, ResponseMessage_1.ResponseMessage.UNAUTHORIZED);
            }
            try {
                const user = yield User_1.default.findOne({
                    where: {
                        apikey: query.apikey
                    },
                });
                this.userData = user;
            }
            catch (error) {
                throw new ResponseError_1.default(ResponseCode_1.ResponseCode.UNAUTHORIZED, ResponseMessage_1.ResponseMessage.UNAUTHORIZED);
            }
        });
    }
    static parseRequest(req) {
        if (req.method === 'GET') {
            return req.query;
        }
        else if (req.method === 'POST') {
            return req.body;
        }
        else {
            throw new ResponseError_1.default(ResponseCode_1.ResponseCode.METHOD_NOT_ALLOWED, ResponseMessage_1.ResponseMessage.METHOD_NOT_ALLOWED);
        }
    }
}
UserService.userData = null;
exports.default = UserService;
