import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getProfile = async (_req: Request, res: Response) => {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" }
  });

  return res.json({ data: profile });
};

export const upsertProfile = async (req: Request, res: Response) => {
  const existing = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" }
  });

  const profile = existing
    ? await prisma.profile.update({
        where: { id: existing.id },
        data: req.body
      })
    : await prisma.profile.create({
        data: req.body
      });

  return res.json({
    message: "Profile updated successfully",
    data: profile
  });
};
