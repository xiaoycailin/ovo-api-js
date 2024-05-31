"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseError extends Error {
    constructor(status, error, data) {
        super(error);
        this.status = status;
        this.error = error;
        this.data = data;
        this.error = error;
        this.data = data;
    }
}
exports.default = ResponseError;
