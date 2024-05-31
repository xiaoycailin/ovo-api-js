import { Router } from "express";
import ovo_user from "../model/User";
import UserService from "../services/UserService";
export const UserRouter = Router()

UserRouter.get('/', async (req, res, next) => {
    try {
        await UserService.authorized(req)
        res.json({ user: UserService.data, pin: UserService.pin })
    } catch (error) {
        next(error)
    }
})
UserRouter.get('/update', async (req, res, next) => {
    try {
        const update = await ovo_user.update({
            where: {
                // id: 1
            },
            update: {
                pin: '336963'
            }
        })

        res.json(update)
    } catch (error) {
        next(error)
    }
})
UserRouter.get('/create', async (req, res) => {
    try {
        const user = await ovo_user.create([
            {
                apikey: 'apikeyasas',
                phone_number: '0823196317604',
                username: 'usernametest'
            },
            {
                apikey: 'apikeyasas',
                phone_number: '0823196317604',
                username: 'usernametest'
            },
            {
                apikey: 'apikeyasas',
                phone_number: '0823196317604',
                username: 'usernametest'
            },
        ])
        res.json(user)
    } catch (error) {
        res.json(null)
    }
})