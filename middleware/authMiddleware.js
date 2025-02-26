import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  
  // Проверяем наличие токена в cookie
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  // Проверяем наличие токена в заголовке Authorization
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Требуется авторизация");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Неверный токен авторизации");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Доступ запрещен. Требуются права администратора');
  }
});
