import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const listTestimonials = async (_req: Request, res: Response) => {
  const data = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
  return res.json({ data });
};

export const createTestimonial = async (req: Request, res: Response) => {
  const data = await prisma.testimonial.create({ data: req.body as any });
  return res.status(201).json({ message: "Testimonial created successfully", data });
};

export const updateTestimonial = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.testimonial.update({
    where: { id },
    data: req.body as any
  });
  return res.json({ message: "Testimonial updated successfully", data });
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  await prisma.testimonial.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Testimonial deleted successfully" });
};
