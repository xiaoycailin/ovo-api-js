import { NextFunction, Request, Response, Router } from "express";
import UserService from "../services/UserService";
import Ovo from "../services/OvoService";
import http from "../helper/request";
import ResponseError from "../error/ResponseError";
import { ResponseCode, ResponseMessage } from "../interface/Enum";
import ovo_user from "../model/User";
import { OvoBalance, OvoResponse } from '../interface/Ovo';
export const OvoRouter = Router()

const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo()
        let phone = ovo.parsePhone(UserService.phone_number?.toString()!)
        const otpResult = await ovo.sendOTP(phone)
        await ovo_user.update({
            where: {
                id: UserService.id,
            },
            update: {
                otp_ref_id: otpResult.data?.otp?.otp_ref_id
            }
        })
        res.json(http.response(ResponseCode.OK, {
            phone,
            result: otpResult
        }))
    } catch (error) {
        next(error)
    }
}

const loginOvo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo()
        const phone = ovo.parsePhone(UserService.phone_number?.toString()!)
        const query = UserService.parseRequest<{ otp_code: string }>(req)

        const verify = await ovo.verifyOTP(phone, UserService.otp_ref_id!, query.otp_code)

        const login = await ovo.getAuthToken(phone, verify.data?.otp?.otp_ref_id!, verify.data?.otp?.otp_token!, UserService.pin as string)

        await ovo_user.update({
            update: {
                access_token: login.data?.auth?.access_token
            },
            where: {
                apikey: UserService.apikey
            }
        })
        res.json(http.response(ResponseCode.OK, login))
    } catch (error) {
        next(error)
    }
}

OvoRouter.route('/request-otp').get(requestOtp).post(requestOtp)
OvoRouter.route('/login-verify').get(loginOvo).post(loginOvo)

OvoRouter.route('/find-qr')
    .get(async (req, res, next) => {
        try {
            const ovo = new Ovo()
            if (req.query.qr) {
                await UserService.authorized(req)
                const qrData = ovo.getQrData(req.query.qr.toString())
                res.json(http.response(ResponseCode.OK, qrData))
            } else {
                throw new ResponseError(ResponseCode.BAD_REQUEST, ResponseMessage.BAD_REQUEST)
            }
        } catch (error) {
            next(error)
        }
    })
OvoRouter.get('/balance', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo(UserService.access_token)
        const balance = await ovo.walletInquiry<OvoResponse<OvoBalance>>()
        const query = UserService.parseRequest<{ get: keyof typeof balance.data }>(req)
        if (query.get && query.get in balance.data!) {
            res.json(balance.data?.[query.get])
        } else {
            res.send(balance.data)
        }
    } catch (error) {
        next(error)
    }
})
OvoRouter.get('/transaction', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo(UserService.access_token)
        const query = UserService.parseRequest(req)
        const trx = await ovo.ordersHistory(query.page, query.limit)
        res.json(trx)
    } catch (error) {
        next(error)
    }
})
OvoRouter.get('/transaction/details', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo(UserService.access_token)
        const query = UserService.parseRequest(req)
        const details = await ovo.orderDetails({
            entry: 'list',
            merchant_id: query.merchant_id,
            merchant_invoice: query.invoice
        })
        res.json(details)
    } catch (error) {
        next(error)
    }
})

OvoRouter.get('/transaction/last', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo(UserService.access_token)
        const query = UserService.parseRequest(req)
        const trx = await ovo.lastTransaction(query.page, query.limit)
        res.json(trx)
    } catch (error) {
        next(error)
    }
})

OvoRouter.get('/find', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo(UserService.access_token)

        res.json(await ovo.isOVO(UserService.parseRequest(req).phone))
    } catch (error) {
        next(error)
    }
})

OvoRouter.get('/transfer', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        const ovo = new Ovo(UserService.access_token)
        const trf = await ovo.transferOVO({
            amount: 10000,
            pin: UserService.pin as string,
            phoneNumber: UserService.parseRequest(req).phone
        })
        res.json(trf)
    } catch (error) {
        next(error)
    }
})