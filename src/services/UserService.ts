import { Request } from "express";
import { RequestBody, UserData } from "../interface/User";
import ovo_user from "../model/User";
import ResponseError from "../error/ResponseError";
import { ResponseCode } from "../interface/Enum/ResponseCode";
import { ResponseMessage } from "../interface/Enum/ResponseMessage";

export default class UserService {
    private static userData: UserData | null = null
    static get pin() {
        return this.userData?.pin
    }
    static get apikey() {
        return this.userData?.apikey
    }
    static get access_token() {
        return this.userData?.access_token
    }
    static get phone_number() {
        return this.userData?.phone_number
    }
    static get id() {
        return this.userData?.id
    }
    static get otp_ref_id() {
        return this.userData?.otp_ref_id
    }
    static get otp_token() {
        return this.userData?.otp_token
    }
    static get data() {
        return this.userData
    }

    static async authorized(req: Request): Promise<void> {
        let query: RequestBody = {
            apikey: null
        }
        // Check if x-apikey header exists and is not empty
        if (req.headers['x-apikey'] && req.headers['x-apikey'] !== '') {
            query.apikey = req.headers['x-apikey'] as string;
        } else if (req.method === 'GET') {
            // If x-apikey header does not exist and method is GET, use query parameter
            query.apikey = req.query.apikey as string;
        } else if (req.method === 'POST') {
            // If x-apikey header does not exist and method is POST, use body parameter
            query.apikey = req.body.apikey as string;
        } else {
            // If none of the above conditions are met, throw method not allowed error
            throw new ResponseError(ResponseCode.METHOD_NOT_ALLOWED, ResponseMessage.METHOD_NOT_ALLOWED);
        }

        // If apikey is still null or undefined, throw unauthorized error
        if (!query.apikey) {
            throw new ResponseError(ResponseCode.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED);
        }

        try {
            const user = await ovo_user.findOne({
                where: {
                    apikey: query.apikey
                },
            })

            this.userData = user
        } catch (error) {
            throw new ResponseError(ResponseCode.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED)
        }
    }

    static parseRequest<T extends Record<string, any>>(req: Request) {
        if (req.method === 'GET') {
            return req.query as T
        } else if (req.method === 'POST') {
            return req.body as T
        } else {
            throw new ResponseError(ResponseCode.METHOD_NOT_ALLOWED, ResponseMessage.METHOD_NOT_ALLOWED)
        }
    }
}