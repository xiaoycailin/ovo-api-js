const BASE_API = "https://api.ovo.id";
const AGW_API = "https://agw.ovo.id";
const AWS_API = "https://api.cp1.ovo.id";

const os = "iOS";
const app_version = "3.54.0";
const client_id = "ovo_ios";
const user_agent = "OVO/21404 CFNetwork/1220.1 Darwin/20.3.0";

/*
@ Device ID (UUIDV4)
@ Generated from self::generateUUIDV4()
*/
const device_id = "6AA4E427-D1B4-4B7E-9C22-F4C0F86F2CFD";

/*
@ Push Notification ID (SHA256 Hash)
@ Generated from self::generateRandomSHA256()
*/
const push_notification_id = "e35f5a9fc1b61d0ab0c83ee5ca05ce155f82dcffee0605f1c70de38e662db362";

const auth_token = false;
const hmac_hash = false;
const hmac_hash_random = false;


const os_ver = '7.1.1'

export {
    BASE_API,
    AGW_API,
    AWS_API,
    os,
    app_version,
    client_id,
    user_agent,
    device_id,
    push_notification_id,
    auth_token,
    hmac_hash,
    hmac_hash_random,
    os_ver
}