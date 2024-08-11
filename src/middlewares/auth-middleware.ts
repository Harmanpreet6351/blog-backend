

// Auth middleware

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../database/db";
import { AuthRequest } from "../types/Base.type";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ message: "Unauthorized" })

  const token = authorization.split(" ")[1]
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!)
    const user = await prisma.user.findUnique({
      where: {
        id: (decoded as { id: number }).id
      }
    })
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    
    (req as AuthRequest).user = user;
    
    next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}