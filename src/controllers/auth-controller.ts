import { Router } from "express";
import { prisma } from "../database/db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const router = Router()

router.post("/login", async (req, res) => {
  const { email, passwd } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) return res.status(401).json({ message: "Invalid credentials" })

  // verify passwd
  const isMatch = await bcrypt.compare(passwd, user.passwd)
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })


  // generate jwt token
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!)


  return res.status(200).json({
    token
  })
})


router.post("/signup", async (req, res) => {
  const { email, passwd } = req.body

  // hash passwd
  const hashedPasswd = await bcrypt.hash(passwd, 10)

  const user = await prisma.user.create({
    data: {
      email,
      passwd: hashedPasswd
    }
  })

  return res.status(201).json(user)
})

export default router