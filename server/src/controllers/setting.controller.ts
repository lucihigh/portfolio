import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getSettings = async (_req: Request, res: Response) => {
  const data = await prisma.siteSetting.findFirst({
    orderBy: { createdAt: "asc" }
  });
  return res.json({ data });
};

export const upsertSettings = async (req: Request, res: Response) => {
  const existing = await prisma.siteSetting.findFirst({
    orderBy: { createdAt: "asc" }
  });

  const data = existing
    ? await prisma.siteSetting.update({
        where: { id: existing.id },
        data: req.body
      })
    : await prisma.siteSetting.create({
        data: req.body
      });

  return res.json({
    message: "Settings updated successfully",
    data
  });
};
