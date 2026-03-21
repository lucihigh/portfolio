import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};
