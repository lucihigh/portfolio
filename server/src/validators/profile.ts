import { z } from "zod";
import { optionalUrl, stringArray } from "./common.js";

export const upsertProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    headline: z.string().min(2),
    headlineVi: z.string().optional(),
    shortBio: z.string().min(10),
    shortBioVi: z.string().optional(),
    about: z.string().min(20),
    aboutVi: z.string().optional(),
    strengths: stringArray,
    strengthsVi: stringArray.optional().default([]),
    careerGoals: stringArray,
    careerGoalsVi: stringArray.optional().default([]),
    avatarUrl: optionalUrl,
    cvUrl: optionalUrl,
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    githubUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    facebookUrl: optionalUrl,
    heroPrimaryLabel: z.string().min(1),
    heroPrimaryLabelVi: z.string().optional(),
    heroPrimaryHref: z.string().min(1),
    heroSecondaryLabel: z.string().min(1),
    heroSecondaryLabelVi: z.string().optional(),
    heroSecondaryHref: z.string().min(1),
    isPublished: z.boolean().default(true)
  })
});
