import { Request, Response, NextFunction } from "express";
import { env } from "../env.js";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("X-Admin-Secret");
  if (!token || token !== env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
