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
exports.OvoRouter = void 0;
const express_1 = require("express");
const UserService_1 = __importDefault(require("../services/UserService"));
const OvoService_1 = __importDefault(require("../services/OvoService"));
const request_1 = __importDefault(require("../helper/request"));
const ResponseError_1 = __importDefault(require("../error/ResponseError"));
const Enum_1 = require("../interface/Enum");
const User_1 = __importDefault(require("../model/User"));
exports.OvoRouter = (0, express_1.Router)();
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default();
        let phone = ovo.parsePhone((_a = UserService_1.default.phone_number) === null || _a === void 0 ? void 0 : _a.toString());
        const otpResult = yield ovo.sendOTP(phone);
        yield User_1.default.update({
            where: {
                id: UserService_1.default.id,
            },
            update: {
                otp_ref_id: (_c = (_b = otpResult.data) === null || _b === void 0 ? void 0 : _b.otp) === null || _c === void 0 ? void 0 : _c.otp_ref_id
            }
        });
        res.json(request_1.default.response(Enum_1.ResponseCode.OK, {
            phone,
            result: otpResult
        }));
    }
    catch (error) {
        next(error);
    }
});
const loginOvo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k;
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default();
        const phone = ovo.parsePhone((_d = UserService_1.default.phone_number) === null || _d === void 0 ? void 0 : _d.toString());
        const query = UserService_1.default.parseRequest(req);
        const verify = yield ovo.verifyOTP(phone, UserService_1.default.otp_ref_id, query.otp_code);
        const login = yield ovo.getAuthToken(phone, (_f = (_e = verify.data) === null || _e === void 0 ? void 0 : _e.otp) === null || _f === void 0 ? void 0 : _f.otp_ref_id, (_h = (_g = verify.data) === null || _g === void 0 ? void 0 : _g.otp) === null || _h === void 0 ? void 0 : _h.otp_token, UserService_1.default.pin);
        yield User_1.default.update({
            update: {
                access_token: (_k = (_j = login.data) === null || _j === void 0 ? void 0 : _j.auth) === null || _k === void 0 ? void 0 : _k.access_token
            },
            where: {
                apikey: UserService_1.default.apikey
            }
        });
        res.json(request_1.default.response(Enum_1.ResponseCode.OK, login));
    }
    catch (error) {
        next(error);
    }
});
exports.OvoRouter.route('/request-otp').get(requestOtp).post(requestOtp);
exports.OvoRouter.route('/login-verify').get(loginOvo).post(loginOvo);
exports.OvoRouter.route('/find-qr')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ovo = new OvoService_1.default();
        if (req.query.qr) {
            yield UserService_1.default.authorized(req);
            const qrData = ovo.getQrData(req.query.qr.toString());
            res.json(request_1.default.response(Enum_1.ResponseCode.OK, qrData));
        }
        else {
            throw new ResponseError_1.default(Enum_1.ResponseCode.BAD_REQUEST, Enum_1.ResponseMessage.BAD_REQUEST);
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.OvoRouter.get('/balance', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default(UserService_1.default.access_token);
        const balance = yield ovo.walletInquiry();
        const query = UserService_1.default.parseRequest(req);
        if (query.get && query.get in balance.data) {
            res.json((_l = balance.data) === null || _l === void 0 ? void 0 : _l[query.get]);
        }
        else {
            res.send(balance.data);
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.OvoRouter.get('/transaction', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default(UserService_1.default.access_token);
        const query = UserService_1.default.parseRequest(req);
        const trx = yield ovo.ordersHistory(query.page, query.limit);
        res.json(trx);
    }
    catch (error) {
        next(error);
    }
}));
exports.OvoRouter.get('/transaction/details', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default(UserService_1.default.access_token);
        const query = UserService_1.default.parseRequest(req);
        const details = yield ovo.orderDetails({
            entry: 'list',
            merchant_id: query.merchant_id,
            merchant_invoice: query.invoice
        });
        res.json(details);
    }
    catch (error) {
        next(error);
    }
}));
exports.OvoRouter.get('/transaction/last', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default(UserService_1.default.access_token);
        const query = UserService_1.default.parseRequest(req);
        const trx = yield ovo.lastTransaction(query.page, query.limit);
        res.json(trx);
    }
    catch (error) {
        next(error);
    }
}));
exports.OvoRouter.get('/find', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default(UserService_1.default.access_token);
        res.json(yield ovo.isOVO(UserService_1.default.parseRequest(req).phone));
    }
    catch (error) {
        next(error);
    }
}));
exports.OvoRouter.get('/transfer', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService_1.default.authorized(req);
        const ovo = new OvoService_1.default(UserService_1.default.access_token);
        const trf = yield ovo.transferOVO({
            amount: 10000,
            pin: UserService_1.default.pin,
            phoneNumber: UserService_1.default.parseRequest(req).phone
        });
        res.json(trf);
    }
    catch (error) {
        next(error);
    }
}));
