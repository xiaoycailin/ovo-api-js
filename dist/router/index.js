"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const ovo_1 = require("./ovo");
exports.Routers = (0, express_1.Router)();
exports.Routers.use('/user', user_1.UserRouter);
exports.Routers.use('/ovo', ovo_1.OvoRouter);
