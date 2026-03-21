import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { comparePassword } from "../utils/password.js";
import { AppError } from "../utils/app-error.js";
import { signToken } from "../utils/jwt.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ userId: user.id, email: user.email });

  return res.json({
    message: "Login successful",
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    }
  });
};
