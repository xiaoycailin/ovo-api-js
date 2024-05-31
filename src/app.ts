import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ResponseCode, ResponseMessage } from './interface/Enum'

import { Routers } from './router'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use('/v1', Routers)

// Middleware untuk menangani error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || ResponseCode.INTERNAL_SERVER_ERROR
    const message = err.message || ResponseMessage.INTERNAL_SERVER_ERROR
    message
    res.status(status).json(err)
})

app.listen(PORT, () => {
    console.log(`Server berjalan di http://${process.env.HOST}:${PORT}`)
})
