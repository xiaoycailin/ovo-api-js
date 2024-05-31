
import crypto from "crypto"
import http from "../helper/request";
import { OvoOrders, OvoOTP, OvoResponse, OvoResponseAuth } from "../interface/Ovo";

const { encryptRSA } = require('../helper/encrypt');

export default class Ovo {
    public BASE_API = "https://api.ovo.id"
    public AGW_API = "https://agw.ovo.id"
    public AWS_API = "https://api.cp1.ovo.id"

    public os = "iOS"
    public app_version = "3.54.0"
    public client_id = "ovo_ios"
    public user_agent = "OVO/21404 CFNetwork/1220.1 Darwin/20.3.0"

    /** 
    @ Device ID (UUIDV4)
    @ Generated from self::generateUUIDV4()
    */
    public device_id = "6AA4E427-D1B4-4B7E-9C22-F4C0F86F2CFD"

    /**
    @ Push Notification ID (SHA256 Hash)
    @ Generated from self::generateRandomSHA256()
    */
    public push_notification_id = "e35f5a9fc1b61d0ab0c83ee5ca05ce155f82dcffee0605f1c70de38e662db362"
    public auth_token = ''
    public hmac_hash = false
    public hmac_hash_random = false

    constructor(token?: string) {
        if (token) {
            this.auth_token = token
        }
    }

    parsePhone(phone: string) {
        if (phone && phone.startsWith('08')) {
            phone = '+62' + phone.slice(1)
        }
        return phone
    }

    generateSHA256() {
        const secret = 'ovo-apps';
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const hash = crypto.createHmac('sha256', secret)
            .update(timestamp)
            .digest('hex');

        return hash;
    }

    private postHeaders(bearer = '') {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'app-version': this.app_version,
            'client-id': this.client_id,
            'device-id': this.device_id,
            'os': this.os,
            'User-Agent': this.user_agent
        }

        if (this.auth_token) {
            headers['Authorization'] = bearer + ' ' + this.auth_token
        }
        return headers as any
    }

    async sendOTP(phone: string | undefined) {
        const field = JSON.stringify({
            msisdn: phone,
            device_id: this.device_id,
            otp: {
                locale: 'EN',
                sms_hash: 'xcastore',
            },
            channel_code: 'ovo_ios'
        })

        http.headers(this.postHeaders())
        const response = await http.post(this.AGW_API + '/v3/user/accounts/otp', field)
        return response as OvoResponse<OvoOTP>
    }

    getQrData(qrString: string) {
        let result: Record<string, any> = {}
        let position = 0

        while (position < qrString.length) {
            let key = qrString.substr(position, 2)
            let length = parseInt(qrString.substr(position + 2, 2), 10)
            let valueStart = position + 4
            let value = qrString.substr(valueStart, length)
            result[key] = value
            position = valueStart + length
        }

        const resFinal = {
            name: result['59'],
            address: result['60'],
            amount: result['54'] === undefined ? 0 : parseInt(result['54']),
            amount_format: result['54'] === undefined ? 0 : 'Rp' + Intl.NumberFormat('id-ID').format(result['54']),
            qr_type: result['54'] === undefined ? 'STATIC' : 'DYNAMIC',
        }
        return resFinal
    }

    async verifyOTP(phone_number: string, otp_ref_id: string, otp_code: string) {
        const field = JSON.stringify({
            msisdn: phone_number,
            device_id: this.device_id,
            channel_code: 'ovo_ios',
            otp: {
                otp_ref_id,
                otp: otp_code,
                type: 'LOGIN'
            },
        })
        http.headers(this.postHeaders())
        const response = await http.post(this.AGW_API + '/v3/user/accounts/otp/validation', field)
        return response as OvoResponse<OvoOTP>
    }

    async getAuthToken(phone_number: string, otp_ref_id: string, otp_token: string, pin: string) {

        const field = JSON.stringify({
            msisdn: phone_number,
            device_id: this.device_id,
            channel_code: 'ovo_ios',
            push_notification_id: this.push_notification_id,
            credentials: {
                otp_token,
                password: {
                    value: await encryptRSA(pin, this.device_id, phone_number, otp_ref_id),
                    format: 'rsa'
                }
            }
        })
        http.headers(this.postHeaders())
        const response = await http.post(this.AGW_API + '/v3/user/accounts/login', field)
        return response as OvoResponse<OvoResponseAuth>
    }

    async walletInquiry<T>() {
        http.headers(this.postHeaders())
        const response = await http.get(this.BASE_API + '/wallet/inquiry')
        return response as T
    }

    async generateTrxId(amount: string | number, actionMark = "OVO Cash") {
        const field = {
            amount: amount,
            actionMark: actionMark
        };
        http.headers(this.postHeaders())
        return await http.post(`${this.BASE_API}/v1.0/api/auth/customer/genTrxId`, field);
    }

    async unlockAndValidateTrxId(amount: string | number, trxId: string, securityCode: string) {
        const field = {
            trxId: trxId,
            securityCode: securityCode,
            appVersion: this.app_version,
            signature: this.generateSignature(amount, trxId)
        };

        http.headers(this.postHeaders())
        return await http.post(`${this.BASE_API}/v1.0/api/auth/customer/unlockAndValidateTrxId`, field)
    }

    generateSignature(amount: string | number, trxId: string) {
        return require('crypto').createHash('sha1').update([trxId, amount, this.device_id].join('||')).digest('hex');
    }

    async transferOVO({ amount, phoneNumber, pin, message }: { amount: string | number, phoneNumber: string, pin: string, message?: string }) {
        const getTrxId = await this.generateTrxId(amount)
        const unlock = await this.unlockAndValidateTrxId(amount, getTrxId.trxId, pin)
        if (unlock.isAuthorized === 'true') {
            const field = {
                amount: amount,
                to: phoneNumber,
                trxId: getTrxId.trxId,
                message: message
            }
            http.headers(this.postHeaders())
            return await http.post(`${this.BASE_API}/v1.0/api/customers/transfer`, field);
        } else {
            return { error: true }
        }
    }

    async ordersHistory(page = 1, limit = 5) {
        http.headers(this.postHeaders())
        return await http.get(`${this.AGW_API}/payment/orders/v1/list?limit=${limit}&page=${page}`) as OvoResponse<OvoOrders>
    }

    async orderDetails(data: { entry: string, merchant_invoice: string, merchant_id: string }) {
        http.headers(this.postHeaders())
        return await http.post(`${this.AGW_API}/payment/orders/v1/details`, data)
    }

    async lastTransaction(page = 1, limit = 5) {
        http.headers(this.postHeaders())
        return await http.get(`${this.BASE_API}/wallet/transaction/last?limit=${limit}&page=${page}&transaction_type=TRANSFER&transaction_type=EXTERNAL%20TRANSFER`)
    }

    async qrisPayment(qrid: string, amount: string | number, pin: string) {
        const getTrxId = await this.generateTrxId(amount, 'PAY_TRX_ID')
        const unlock = await this.unlockAndValidateTrxId(amount, getTrxId.trxId, pin)
        console.log(unlock)
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

            http.headers(this.postHeaders())
            const response = await http.post(this.BASE_API + '/wallet/purchase/qr?qrid=' + encodeURI(qrid), field)
            return response
        } else {
            return { unlock }
        }
    }


    async isOVO(phone: number) {
        return await http.headers(this.postHeaders()).post(`${this.BASE_API}/v1.1/api/auth/customer/isOVO`, {
            amount: 0,
            mobile: phone
        })
    }

    async getPublicKeys() {
        http.headers(this.postHeaders())
        const pubkey = await http.get(this.AGW_API + '/v3/user/public_keys')
        return pubkey
    }

    async hashPassword(phone_number: string, otp_ref_id: string, security_code: string) {
        const pubKey = await this.getPublicKeys()

        const rsa_key = pubKey.data.data.keys[0].key
        const data = [
            'LOGIN',
            security_code,
            Date.now(),
            this.device_id,
            phone_number,
            this.device_id,
            otp_ref_id
        ].join('|')
        let encrypted = ''
        const buffer = Buffer.from(data)
        const encryptedBuffer = crypto.publicEncrypt(rsa_key, buffer)
        encrypted = encryptedBuffer.toString('base64')
        return encrypted
    }

}