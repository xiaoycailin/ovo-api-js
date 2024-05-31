"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = void 0;
var ResponseMessage;
(function (ResponseMessage) {
    ResponseMessage["OK"] = "Request berhasil diproses.";
    ResponseMessage["BAD_REQUEST"] = "Permintaan tidak valid.";
    ResponseMessage["UNAUTHORIZED"] = "Otentikasi gagal.";
    ResponseMessage["FORBIDDEN"] = "Akses ditolak.";
    ResponseMessage["NOT_FOUND"] = "Sumber tidak ditemukan.";
    ResponseMessage["METHOD_NOT_ALLOWED"] = "Metode permintaan tidak diizinkan.";
    ResponseMessage["INTERNAL_SERVER_ERROR"] = "Kesalahan server internal.";
})(ResponseMessage || (exports.ResponseMessage = ResponseMessage = {}));
