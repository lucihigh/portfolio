import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const toOptionalString = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toActivityData = (body: Request["body"]) => ({
  title: body.title,
  titleVi: toOptionalString(body.titleVi),
  organization: body.organization,
  organizationVi: toOptionalString(body.organizationVi),
  slug: body.slug,
  description: body.description,
  descriptionVi: toOptionalString(body.descriptionVi),
  role: toOptionalString(body.role),
  roleVi: toOptionalString(body.roleVi),
  startDate: new Date(body.startDate),
  endDate: body.endDate ? new Date(body.endDate) : null,
  location: toOptionalString(body.location),
  highlights: Array.isArray(body.highlights) ? body.highlights : [],
  highlightsVi: Array.isArray(body.highlightsVi) ? body.highlightsVi : [],
  imageUrl: toOptionalString(body.imageUrl),
  sortOrder: body.sortOrder,
  isPublished: body.isPublished
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
