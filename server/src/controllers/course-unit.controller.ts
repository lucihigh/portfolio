import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const listCourseUnits = async (_req: Request, res: Response) => {
  const data = await prisma.courseUnit.findMany({
    orderBy: [{ sortOrder: "asc" }, { term: "asc" }, { unitCode: "asc" }]
  });
  return res.json({ data });
};

export const createCourseUnit = async (req: Request, res: Response) => {
  const data = await prisma.courseUnit.create({ data: req.body as any });
  return res.status(201).json({ message: "Course unit created successfully", data });
};

export const updateCourseUnit = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.courseUnit.update({
    where: { id },
    data: req.body as any
  });
  return res.json({ message: "Course unit updated successfully", data });
};

export const deleteCourseUnit = async (req: Request, res: Response) => {
  await prisma.courseUnit.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Course unit deleted successfully" });
};
