"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.os_ver = exports.hmac_hash_random = exports.hmac_hash = exports.auth_token = exports.push_notification_id = exports.device_id = exports.user_agent = exports.client_id = exports.app_version = exports.os = exports.AWS_API = exports.AGW_API = exports.BASE_API = void 0;
const BASE_API = "https://api.ovo.id";
exports.BASE_API = BASE_API;
const AGW_API = "https://agw.ovo.id";
exports.AGW_API = AGW_API;
const AWS_API = "https://api.cp1.ovo.id";
exports.AWS_API = AWS_API;
const os = "iOS";
exports.os = os;
const app_version = "3.54.0";
exports.app_version = app_version;
const client_id = "ovo_ios";
exports.client_id = client_id;
const user_agent = "OVO/21404 CFNetwork/1220.1 Darwin/20.3.0";
exports.user_agent = user_agent;
/*
@ Device ID (UUIDV4)
@ Generated from self::generateUUIDV4()
*/
const device_id = "6AA4E427-D1B4-4B7E-9C22-F4C0F86F2CFD";
exports.device_id = device_id;
/*
@ Push Notification ID (SHA256 Hash)
@ Generated from self::generateRandomSHA256()
*/
const push_notification_id = "e35f5a9fc1b61d0ab0c83ee5ca05ce155f82dcffee0605f1c70de38e662db362";
exports.push_notification_id = push_notification_id;
const auth_token = false;
exports.auth_token = auth_token;
const hmac_hash = false;
exports.hmac_hash = hmac_hash;
const hmac_hash_random = false;
exports.hmac_hash_random = hmac_hash_random;
const os_ver = '7.1.1';
exports.os_ver = os_ver;
