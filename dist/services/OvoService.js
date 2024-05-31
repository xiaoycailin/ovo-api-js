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
const request_1 = __importDefault(require("../helper/request"));
const { encryptRSA } = require('../helper/encrypt');
class Ovo {
    constructor(token) {
        this.BASE_API = "https://api.ovo.id";
        this.AGW_API = "https://agw.ovo.id";
        this.AWS_API = "https://api.cp1.ovo.id";
        this.os = "iOS";
        this.app_version = "3.54.0";
        this.client_id = "ovo_ios";
        this.user_agent = "OVO/21404 CFNetwork/1220.1 Darwin/20.3.0";
        /**
        @ Device ID (UUIDV4)
        @ Generated from self::generateUUIDV4()
        */
        this.device_id = "6AA4E427-D1B4-4B7E-9C22-F4C0F86F2CFD";
        /**
        @ Push Notification ID (SHA256 Hash)
        @ Generated from self::generateRandomSHA256()
        */
        this.push_notification_id = "e35f5a9fc1b61d0ab0c83ee5ca05ce155f82dcffee0605f1c70de38e662db362";
        this.auth_token = '';
        this.hmac_hash = false;
        this.hmac_hash_random = false;
        if (token) {
            this.auth_token = token;
        }
    }
    parsePhone(phone) {
        if (phone && phone.startsWith('08')) {
            phone = '+62' + phone.slice(1);
        }
        return phone;
    }
    generateSHA256() {
        const secret = 'ovo-apps';
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const hash = crypto_1.default.createHmac('sha256', secret)
            .update(timestamp)
            .digest('hex');
        return hash;
    }
    postHeaders(bearer = '') {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'app-version': this.app_version,
            'client-id': this.client_id,
            'device-id': this.device_id,
            'os': this.os,
            'User-Agent': this.user_agent
        };
        if (this.auth_token) {
            headers['Authorization'] = bearer + ' ' + this.auth_token;
        }
        return headers;
    }
    sendOTP(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = JSON.stringify({
                msisdn: phone,
                device_id: this.device_id,
                otp: {
                    locale: 'EN',
                    sms_hash: 'xcastore',
                },
                channel_code: 'ovo_ios'
            });
            request_1.default.headers(this.postHeaders());
            const response = yield request_1.default.post(this.AGW_API + '/v3/user/accounts/otp', field);
            return response;
        });
    }
    getQrData(qrString) {
        let result = {};
        let position = 0;
        while (position < qrString.length) {
            let key = qrString.substr(position, 2);
            let length = parseInt(qrString.substr(position + 2, 2), 10);
            let valueStart = position + 4;
            let value = qrString.substr(valueStart, length);
            result[key] = value;
            position = valueStart + length;
        }
        const resFinal = {
            name: result['59'],
            address: result['60'],
            amount: result['54'] === undefined ? 0 : parseInt(result['54']),
            amount_format: result['54'] === undefined ? 0 : 'Rp' + Intl.NumberFormat('id-ID').format(result['54']),
            qr_type: result['54'] === undefined ? 'STATIC' : 'DYNAMIC',
        };
        return resFinal;
    }
    verifyOTP(phone_number, otp_ref_id, otp_code) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = JSON.stringify({
                msisdn: phone_number,
                device_id: this.device_id,
                channel_code: 'ovo_ios',
                otp: {
                    otp_ref_id,
                    otp: otp_code,
                    type: 'LOGIN'
                },
            });
            request_1.default.headers(this.postHeaders());
            const response = yield request_1.default.post(this.AGW_API + '/v3/user/accounts/otp/validation', field);
            return response;
        });
    }
    getAuthToken(phone_number, otp_ref_id, otp_token, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = JSON.stringify({
                msisdn: phone_number,
                device_id: this.device_id,
                channel_code: 'ovo_ios',
                push_notification_id: this.push_notification_id,
                credentials: {
                    otp_token,
                    password: {
                        value: yield encryptRSA(pin, this.device_id, phone_number, otp_ref_id),
                        format: 'rsa'
                    }
                }
            });
            request_1.default.headers(this.postHeaders());
            const response = yield request_1.default.post(this.AGW_API + '/v3/user/accounts/login', field);
            return response;
        });
    }
    walletInquiry() {
        return __awaiter(this, void 0, void 0, function* () {
            request_1.default.headers(this.postHeaders());
            const response = yield request_1.default.get(this.BASE_API + '/wallet/inquiry');
            return response;
        });
    }
    generateTrxId(amount_1) {
        return __awaiter(this, arguments, void 0, function* (amount, actionMark = "OVO Cash") {
            const field = {
                amount: amount,
                actionMark: actionMark
            };
            request_1.default.headers(this.postHeaders());
            return yield request_1.default.post(`${this.BASE_API}/v1.0/api/auth/customer/genTrxId`, field);
        });
    }
    unlockAndValidateTrxId(amount, trxId, securityCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = {
                trxId: trxId,
                securityCode: securityCode,
                appVersion: this.app_version,
                signature: this.generateSignature(amount, trxId)
            };
            request_1.default.headers(this.postHeaders());
            return yield request_1.default.post(`${this.BASE_API}/v1.0/api/auth/customer/unlockAndValidateTrxId`, field);
        });
    }
    generateSignature(amount, trxId) {
        return require('crypto').createHash('sha1').update([trxId, amount, this.device_id].join('||')).digest('hex');
    }
    transferOVO(_a) {
        return __awaiter(this, arguments, void 0, function* ({ amount, phoneNumber, pin, message }) {
            const getTrxId = yield this.generateTrxId(amount);
            const unlock = yield this.unlockAndValidateTrxId(amount, getTrxId.trxId, pin);
            if (unlock.isAuthorized === 'true') {
                const field = {
                    amount: amount,
                    to: phoneNumber,
                    trxId: getTrxId.trxId,
                    message: message
                };
                request_1.default.headers(this.postHeaders());
                return yield request_1.default.post(`${this.BASE_API}/v1.0/api/customers/transfer`, field);
            }
            else {
                return { error: true };
            }
        });
    }
    ordersHistory() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 5) {
            request_1.default.headers(this.postHeaders());
            return yield request_1.default.get(`${this.AGW_API}/payment/orders/v1/list?limit=${limit}&page=${page}`);
        });
    }
    orderDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            request_1.default.headers(this.postHeaders());
            return yield request_1.default.post(`${this.AGW_API}/payment/orders/v1/details`, data);
        });
    }
    lastTransaction() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 5) {
            request_1.default.headers(this.postHeaders());
            return yield request_1.default.get(`${this.BASE_API}/wallet/transaction/last?limit=${limit}&page=${page}&transaction_type=TRANSFER&transaction_type=EXTERNAL%20TRANSFER`);
        });
    }
    qrisPayment(qrid, amount, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            const getTrxId = yield this.generateTrxId(amount, 'PAY_TRX_ID');
            const unlock = yield this.unlockAndValidateTrxId(amount, getTrxId.trxId, pin);
            console.log(unlock);
            if (unlock.isAuthorized === 'true') {
                const field = {
                    qrPayload: qrid,
                    locationInfo: {
                        accuracy: 11.00483309472351,
                        verticalAccuracy: 3,
                        longitude: 84.90665207978246,
                        heading: 11.704396994254495,
                        latitude: -9.432921591875759,
                        altitude: 84.28827400936305,
                        speed: 0.11528167128562927
                    },
                    deviceInfo: {
                        deviceBrand: 'Apple',
                        deviceModel: 'iPhone',
                        appVersion: this.app_version,
                        deviceToken: this.push_notification_id
                    },
                    paymentDetail: [
                        {
                            amount: amount,
                            id: '001',
                            name: 'OVO Cash'
                        }
                    ],
                    transactionId: getTrxId.trxId,
                    appsource: 'OVO-APPS'
                };
                request_1.default.headers(this.postHeaders());
                const response = yield request_1.default.post(this.BASE_API + '/wallet/purchase/qr?qrid=' + encodeURI(qrid), field);
                return response;
            }
            else {
                return { unlock };
            }
        });
    }
    isOVO(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield request_1.default.headers(this.postHeaders()).post(`${this.BASE_API}/v1.1/api/auth/customer/isOVO`, {
                amount: 0,
                mobile: phone
            });
        });
    }
    getPublicKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            request_1.default.headers(this.postHeaders());
            const pubkey = yield request_1.default.get(this.AGW_API + '/v3/user/public_keys');
            return pubkey;
        });
    }
    hashPassword(phone_number, otp_ref_id, security_code) {
        return __awaiter(this, void 0, void 0, function* () {
            const pubKey = yield this.getPublicKeys();
            const rsa_key = pubKey.data.data.keys[0].key;
            const data = [
                'LOGIN',
                security_code,
                Date.now(),
                this.device_id,
                phone_number,
                this.device_id,
                otp_ref_id
            ].join('|');
            let encrypted = '';
            const buffer = Buffer.from(data);
            const encryptedBuffer = crypto_1.default.publicEncrypt(rsa_key, buffer);
            encrypted = encryptedBuffer.toString('base64');
            return encrypted;
        });
    }
}
exports.default = Ovo;
