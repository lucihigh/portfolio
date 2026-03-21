import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const listContacts = async (_req: Request, res: Response) => {
  const data = await prisma.contactLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  return res.json({ data });
};

export const createContact = async (req: Request, res: Response) => {
  const data = await prisma.contactLink.create({ data: req.body as any });
  return res.status(201).json({ message: "Contact created successfully", data });
};

export const updateContact = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await prisma.contactLink.update({
    where: { id },
    data: req.body as any
  });
  return res.json({ message: "Contact updated successfully", data });
};

export const deleteContact = async (req: Request, res: Response) => {
  await prisma.contactLink.delete({ where: { id: req.params.id as string } });
  return res.json({ message: "Contact deleted successfully" });
};
