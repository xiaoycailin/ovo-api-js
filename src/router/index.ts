import { Router } from "express";
import { UserRouter } from "./user";
import { OvoRouter } from "./ovo";

export const Routers = Router()

Routers.use('/user', UserRouter)
Routers.use('/ovo', OvoRouter)