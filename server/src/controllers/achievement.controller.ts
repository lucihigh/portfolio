import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const toAchievementData = (body: Request["body"]) => ({
  ...body,
  date: body.date ? new Date(body.date) : null
});

export const listAchievements = async (_req: Request, res: Response) => {
  const data = await prisma.achievement.findMany({
    orderBy: [{ date: "desc" }, { sortOrder: "asc" }]
  });
  return res.json({ data });
};

export const createAchievement = async (req: Request, res: Response) => {
  const data = await prisma.achievement.create({ data: toAchievementData(req.body) as any });
  return res.status(201).json({ message: "Achievement created successfully", data });
};

export const updateAchievement = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.achievement.update({
    where: { id },
    data: toAchievementData(req.body) as any
  });
  return res.json({ message: "Achievement updated successfully", data });
};

export const deleteAchievement = async (req: Request, res: Response) => {
  await prisma.achievement.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Achievement deleted successfully" });
};
