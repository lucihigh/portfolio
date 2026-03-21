import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const listProjects = async (_req: Request, res: Response) => {
  const data = await prisma.project.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
  });
  return res.json({ data });
};

export const createProject = async (req: Request, res: Response) => {
  const data = await prisma.project.create({ data: req.body as any });
  return res.status(201).json({ message: "Project created successfully", data });
};

export const updateProject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.project.update({
    where: { id },
    data: req.body as any
  });
  return res.json({ message: "Project updated successfully", data });
};

export const deleteProject = async (req: Request, res: Response) => {
  await prisma.project.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Project deleted successfully" });
};
