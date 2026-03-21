import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getPublicData = async (_req: Request, res: Response) => {
  const [profile, skills, activities, projects, courseUnits, achievements, testimonials, contacts, settings] =
    await Promise.all([
      prisma.profile.findFirst({ where: { isPublished: true } }),
      prisma.skill.findMany({
        where: { isPublished: true },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      prisma.activity.findMany({
        where: { isPublished: true },
        orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }]
      }),
      prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      prisma.courseUnit.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { term: "asc" }, { unitCode: "asc" }]
      }),
      prisma.achievement.findMany({
        where: { isPublished: true },
        orderBy: [{ date: "desc" }, { sortOrder: "asc" }]
      }),
      prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      prisma.contactLink.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }),
      prisma.siteSetting.findFirst({ orderBy: { createdAt: "asc" } })
    ]);

  return res.json({
    data: {
      profile,
      skills,
      activities,
      projects,
      courseUnits,
      achievements,
      testimonials,
      contacts,
      settings
    }
  });
};

export const submitPublicTestimonial = async (req: Request, res: Response) => {
  const maxOrder = await prisma.testimonial.aggregate({
    _max: { sortOrder: true }
  });

  const testimonial = await prisma.testimonial.create({
    data: {
      name: req.body.name,
      role: req.body.role,
      company: req.body.company || undefined,
      content: req.body.content,
      avatarUrl: req.body.avatarUrl || undefined,
      isPublished: true,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1
    }
  });

  return res.status(201).json({
    message: "Thank you for your feedback. It is now live on the portfolio.",
    data: testimonial
  });
};
