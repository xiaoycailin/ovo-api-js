export interface UserData {
    id?: number;
    username?: string;
    apikey?: string;
    access_token?: string;
    phone_number?: string;
    pin?: string;
    otp_ref_id?: string;
    otp_token?: string;
    [key: string]: any;
}

export interface UserQuery {
    where?: UserData
    update?: UserData
    create?: UserData | UserData[]
}

export interface RequestBody {
    apikey: string | null
    amount?: string | number
    destination?: string
    note?: string
}