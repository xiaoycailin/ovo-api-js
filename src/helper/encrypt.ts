import crypto from 'crypto';
import constants from 'constants';
import http from './request';
const { app_version, user_agent, os, os_ver, client_id, AGW_API } = require('../database/config')

const encryptRSA = async (securityCode: string, deviceId: string, phoneNumber: string, otpRefId: string) => {
    const headers = {
        'App-Version': app_version,
        'User-Agent': user_agent,
        'OS': os,
        'OS-Version': os_ver,
        'client-id': client_id,
    }
    var d = new Date();
    var n = d.getTime();
    let currentTimeMillies = n
    http.headers(headers as any)
    const RSA = await http.get(AGW_API + '/v3/user/public_keys')

    let string = "LOGIN|" + securityCode + "|" + currentTimeMillies + "|" + deviceId + "|" + phoneNumber + "|" + deviceId + "|" + otpRefId
    return crypto.publicEncrypt({
        "key": RSA.data?.keys[0]?.key,
        padding: constants.RSA_PKCS1_PADDING
    }, Buffer.from(string, "utf8")).toString("base64");
}

module.exports = {
    encryptRSA
};