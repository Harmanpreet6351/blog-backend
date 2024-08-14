import { Router } from "express";
import { prisma } from "../database/db";
import { PaginatedResult } from "../types/Base.type";
import { Article } from '@prisma/client';


const router = Router({
  mergeParams: true
})

// /api/v1/users/:userId/articles
router.post("/articles", async (req, res) => {
  const { title, body } = req.body

  // const currentUser = (req as AuthRequest).user

  const { userId } = req.params as {[key: string]: string}

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  })

  if (!user) return res.status(404).json({ message: "User not found" })

  const article = await prisma.article.create({
    data: {
      title: title as string,
      body: body as string,
      userId: user.id
    }
  })
  return res.status(201).json({
    message: "Article created successfully",
    data: article
  })

})


// get all articles
router.get("/articles", async (req, res) => {

  const {userId } = req.params as {[key: string]: string}
  const page = parseInt(req.query.page as string) || 1;  
  const limit = parseInt(req.query.limit as string) || 10;
  if (!userId) {
    return res.status(400).json({ message: "UserId is required" })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  })
  if (!user) return res.status(404).json({ message: "User not found" })

  const skip = (page - 1) * limit;

  const articles = await prisma.article.findMany({
    where: {
      userId: user.id, 
    },
    skip: skip,
    take: limit,
  });

  const articleCount = await prisma.article.count({
    where: {
      userId: user.id
    }
  })

  const totalPages = Math.ceil(articleCount / limit);

  const paginatedResult: PaginatedResult<Article> = {
    total: articleCount,
    page: page,
    limit: limit,
    totalPages: totalPages,
    data: articles,
  };

  return res.status(200).json(paginatedResult);
})

//update article

router.put('/articles/:article_id',async (req,res) => {
  const { article_id } =  req.params
  const { title, body } = req.body

  const article = await prisma.article.update({
    where: {
      id: Number(article_id)
    },
    data: {
      title: title as string,
      body: body as string,
    }
  })

  return res.status(200).json({data: article})

})

// delete article

router.delete('/articles/:article_id',async (req,res) => {
  const { article_id } =  req.params

  try {
    const article = await prisma.article.delete({
      where:{
        id: Number(article_id)
      }
    })
    return res.status(200).json({data: article})
  }
  catch(e){
    return res.status(404).json({error: `article id : ${article_id} was not found`})
  }
  
})

export default router