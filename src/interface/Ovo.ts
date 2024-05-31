export interface OvoResponseAuth {
    auth?: {
        access_token?: string
        token_type?: string
        expires_in?: string
        refresh_token?: string
        scope?: string
    }
}
export interface OvoResponseAuthAccount {
    account?: {
        ovo_id: string;
        msisdn: string;
        account_status: string;
        kyc_status: string;
        authentication: string;
        push_notification_id: string;
    }
}

export interface CardInfo {
    card_balance: number;
    card_no: string;
    payment_method: string;
}
export interface OvoBalance {
    '001'?: CardInfo
    '600'?: CardInfo
}

export interface OvoOTP {
    otp?: {
        otp_ref_id?: string;
        type?: string;
        expires_at?: number;
        cooldown_period?: number;
        length?: number;
        reff_type?: string
        otp_token?: string
    }
}

export interface OvoNextAction {
    host: string;
    path: string;
    method: string;
    body: {
        entry: string;
        merchant_invoice: string;
        merchant_id: string;
    };
}

export interface OvoTransaction {
    merchant_invoice: string;
    merchant_id: string;
    merchant_name: string;
    card_no: string;
    transaction_amount: string;
    transaction_fee: string;
    desc1: string;
    desc2: string;
    desc3: string;
    status: string;
    ui_type: number;
    transaction_type: string;
    transaction_type_id: number;
    icon_url: string;
    category_id: number;
    category_name: string;
    next: OvoNextAction;
    order_client_id: string;
    transaction_date: string;
    transaction_time: string;
    ovo_earn: number;
    ovo_used: number;
    emoney_used: number;
    emoney_topup: number;
    emoney_bonus: number;
}

export interface OvoOrders {
    status: number
    orders: {
        complete: OvoTransaction[]
        pending: any[] | OvoTransaction[]
    }[],
    message: string
}
export interface OvoResponse<T = any> {
    data?: T
    response_code?: string
    response_message?: string
    response_version?: string
    primary?: string
    messsage?: string
}
