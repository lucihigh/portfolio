import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const listSkills = async (_req: Request, res: Response) => {
  const data = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
  });
  return res.json({ data });
};

export const createSkill = async (req: Request, res: Response) => {
  const data = await prisma.skill.create({ data: req.body as any });
  return res.status(201).json({ message: "Skill created successfully", data });
};

export const updateSkill = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.skill.update({
    where: { id },
    data: req.body as any
  });
  return res.json({ message: "Skill updated successfully", data });
};

export const deleteSkill = async (req: Request, res: Response) => {
  await prisma.skill.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Skill deleted successfully" });
};
