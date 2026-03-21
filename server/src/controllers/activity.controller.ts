import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const toActivityData = (body: Request["body"]) => ({
  ...body,
  startDate: new Date(body.startDate),
  endDate: body.endDate ? new Date(body.endDate) : null
});

export const listActivities = async (_req: Request, res: Response) => {
  const data = await prisma.activity.findMany({
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }]
  });
  return res.json({ data });
};

export const createActivity = async (req: Request, res: Response) => {
  const data = await prisma.activity.create({ data: toActivityData(req.body) as any });
  return res.status(201).json({ message: "Activity created successfully", data });
};

export const updateActivity = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.activity.update({
    where: { id },
    data: toActivityData(req.body) as any
  });
  return res.json({ message: "Activity updated successfully", data });
};

export const deleteActivity = async (req: Request, res: Response) => {
  await prisma.activity.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Activity deleted successfully" });
};
