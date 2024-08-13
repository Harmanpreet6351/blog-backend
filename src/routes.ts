import { Router } from "express";

import AuthRouter from "./controllers/auth-controller"
import ArticleRouter from "./controllers/article-controller"
import { authMiddleware } from "./middlewares/auth-middleware";
import CommentRouter from "./controllers/comment-controller"

const router = Router()

router.use("/api/v1", AuthRouter)

router.use("/api/v1/users/:userId", authMiddleware,ArticleRouter)
router.use("/api/v1/users/:userId",authMiddleware,CommentRouter)


export default router