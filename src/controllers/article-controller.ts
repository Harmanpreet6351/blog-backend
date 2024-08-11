import { Router } from "express";
import { prisma } from "../database/db";
// import { AuthRequest } from "../types/Base.type";


const router = Router({
  mergeParams: true
})

// /api/v1/users/:userId/articles
router.post("/articles", async (req, res) => {
  const { title, body } = req.body

  // const currentUser = (req as AuthRequest).user

  const {userId } = req.params as {[key: string]: string}

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
  return res.status(201).json(article)

})


// get all articles
router.get("/articles", async (req, res) => {

  const {userId } = req.params as {[key: string]: string}
  if (!userId) {
    return res.status(400).json({ message: "UserId is required" })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  })
  if (!user) return res.status(404).json({ message: "User not found" })

  const articles = await prisma.article.findMany({
    where: {
      user: {
        id: user.id
      }
    },
  })

  const articleCount = await prisma.article.count({
    where: {
      user: {
        id: user.id
      }
    }
  })

  const paginated_obj = {
    total: articleCount,
    data: articles
  }

  return res.status(200).json(paginated_obj)
})

export default router