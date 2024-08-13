import { Request } from "express"
import type { User } from "@prisma/client"

export interface AuthRequest extends Request {
  user: User
}


export type PaginatedResult<T> = {
  total: number;         // Total number of items
  page: number;          // Current page number
  limit: number;         // Items per page
  totalPages: number;    // Total number of pages
  data: T[];             // Array of items of generic type T
};