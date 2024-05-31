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
exports.UserRouter = void 0;
const express_1 = require("express");
const User_1 = __importDefault(require("../model/User"));
const UserService_1 = __importDefault(require("../services/UserService"));
exports.UserRouter = (0, express_1.Router)();
exports.UserRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService_1.default.authorized(req);
        res.json({ user: UserService_1.default.data, pin: UserService_1.default.pin });
    }
    catch (error) {
        next(error);
    }
}));
exports.UserRouter.get('/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const update = yield User_1.default.update({
            where: {
            // id: 1
            },
            update: {
                pin: '336963'
            }
        });
        res.json(update);
    }
    catch (error) {
        next(error);
    }
}));
exports.UserRouter.get('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.create([
            {
                apikey: 'apikeyasas',
                phone_number: '0823196317604',
                username: 'usernametest'
            },
            {
                apikey: 'apikeyasas',
                phone_number: '0823196317604',
                username: 'usernametest'
            },
            {
                apikey: 'apikeyasas',
                phone_number: '0823196317604',
                username: 'usernametest'
            },
        ]);
        res.json(user);
    }
    catch (error) {
        res.json(null);
    }
}));
