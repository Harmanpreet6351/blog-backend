import { Router } from "express";

import AuthRouter from "./controllers/auth-controller"

const router = Router()

router.use("/api/v1", AuthRouter)


export default router