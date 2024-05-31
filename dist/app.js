"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const Enum_1 = require("./interface/Enum");
const router_1 = require("./router");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/v1', router_1.Routers);
// Middleware untuk menangani error
app.use((err, req, res, next) => {
    const status = err.status || Enum_1.ResponseCode.INTERNAL_SERVER_ERROR;
    const message = err.message || Enum_1.ResponseMessage.INTERNAL_SERVER_ERROR;
    message;
    res.status(status).json(err);
});
app.listen(PORT, () => {
    console.log(`Server berjalan di http://${process.env.HOST}:${PORT}`);
});
