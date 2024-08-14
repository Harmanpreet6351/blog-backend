import { Router } from "express";
import { prisma } from "../database/db";
import { AuthRequest, PaginatedResult } from "../types/Base.type";
import { Comment } from "@prisma/client"

const router = Router({
    mergeParams: true
})

router.post('/comments',async (req, res) => {
    const {  body } = req.body as Comment
    const user =  (req as AuthRequest).user
    const  { article_id } = req.params as {[key: string]: number}
    console.log(user)
    const currentArticle = await prisma.article.findUnique({
        where:{
            id: Number(article_id),
            userId:+user.id
        },
        include: {
            user: true
        }
    })

    if(!currentArticle) {
        return res.status(404).json({message: 'Article not found'})
    }

    const comment = await prisma.comment.create({
        data: {
            body,
            userId: user.id,
            articleId: currentArticle.id,
        }
    })


    return res.status(201).json({
        message: "comment created successfully",
        data: comment
      })
})

router.get('/comments',async (req, res) => {

    const  { article_id,userId } = req.params as {[key: string]: number}

    const user =  (req as AuthRequest).user

    const currentArticle = await prisma.article.findUnique({
        where:{
            id: Number(article_id),
            userId: Number(userId)
        },
    })

    console.log(currentArticle)
    if(!currentArticle) {
        return res.status(404).json({message: 'Article not found'})
    }
   
    const comment = await prisma.comment.findMany({
        where: {
            articleId: Number(article_id),
            userId: Number(userId)
        }
    })

    res.status(200).json({
        comment: comment
    })
})













export default router