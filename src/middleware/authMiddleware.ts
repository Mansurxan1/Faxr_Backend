import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler";
import User from "../models/User";
import { AuthRequest } from '../types/express';

interface JwtPayload {
  userId: string;
}

export const authenticate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Требуется авторизация");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Неверный токен авторизации");
  }
});

export const isAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Доступ запрещен. Требуются права администратора');
  }
}); 