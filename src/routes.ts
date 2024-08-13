import { Router } from "express";

import AuthRouter from "./controllers/auth-controller"
import ArticleRouter from "./controllers/article-controller"
import { authMiddleware } from "./middlewares/auth-middleware";
import CommentRouter from "./controllers/comment-controller"

const router = Router()

router.use(AuthRouter)

router.use("/users/:userId", authMiddleware,ArticleRouter)
router.use("/users/:userId",authMiddleware,CommentRouter)


export default router