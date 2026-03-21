import { z } from "zod";
import { optionalDate, optionalUrl, stringArray } from "./common.js";

const baseEntity = {
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true)
};

export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    nameVi: z.string().optional(),
    category: z.string().min(1),
    categoryVi: z.string().optional(),
    level: z.string().optional(),
    levelVi: z.string().optional(),
    description: z.string().optional(),
    descriptionVi: z.string().optional(),
    icon: z.string().optional(),
    ...baseEntity
  })
});

export const activitySchema = z.object({
  body: z.object({
    title: z.string().min(2),
    titleVi: z.string().optional(),
    organization: z.string().min(2),
    organizationVi: z.string().optional(),
    slug: z.string().min(2),
    description: z.string().min(10),
    descriptionVi: z.string().optional(),
    role: z.string().optional(),
    roleVi: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: optionalDate,
    location: z.string().optional(),
    highlights: stringArray,
    highlightsVi: stringArray.optional().default([]),
    imageUrl: optionalUrl,
    ...baseEntity
  })
});

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    titleVi: z.string().optional(),
    slug: z.string().min(2),
    description: z.string().min(10),
    descriptionVi: z.string().optional(),
    courseScore: z.string().optional(),
    role: z.string().optional(),
    roleVi: z.string().optional(),
    imageUrl: optionalUrl,
    githubUrl: optionalUrl,
    demoUrl: optionalUrl,
    technologies: stringArray,
    technologiesVi: stringArray.optional().default([]),
    highlights: stringArray,
    highlightsVi: stringArray.optional().default([]),
    sortOrder: z.coerce.number().int().default(0),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true)
  })
});

export const achievementSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    titleVi: z.string().optional(),
    issuer: z.string().optional(),
    issuerVi: z.string().optional(),
    description: z.string().min(10),
    descriptionVi: z.string().optional(),
    date: optionalDate,
    imageUrl: optionalUrl,
    credentialUrl: optionalUrl,
    ...baseEntity
  })
});

export const courseUnitSchema = z.object({
  body: z.object({
    stage: z.coerce.number().int().optional(),
    term: z.string().min(2),
    termVi: z.string().optional(),
    unitCode: z.string().min(2),
    unitName: z.string().min(2),
    unitNameVi: z.string().optional(),
    credits: z.coerce.number().int().default(15),
    grade: z.string().optional(),
    status: z.string().min(2),
    statusVi: z.string().optional(),
    ...baseEntity
  })
});

export const testimonialSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    roleVi: z.string().optional(),
    company: z.string().optional(),
    companyVi: z.string().optional(),
    content: z.string().min(10),
    contentVi: z.string().optional(),
    avatarUrl: optionalUrl,
    ...baseEntity
  })
});

export const contactSchema = z.object({
  body: z.object({
    platform: z.string().min(1),
    platformVi: z.string().optional(),
    label: z.string().min(1),
    labelVi: z.string().optional(),
    url: z.string().url(),
    icon: z.string().optional(),
    ...baseEntity
  })
});

export const siteSettingSchema = z.object({
  body: z.object({
    siteTitle: z.string().min(2),
    siteTitleVi: z.string().optional(),
    siteDescription: z.string().min(10),
    siteDescriptionVi: z.string().optional(),
    courseShowcaseEyebrow: z.string().optional(),
    courseShowcaseEyebrowVi: z.string().optional(),
    courseShowcaseTitle: z.string().optional(),
    courseShowcaseTitleVi: z.string().optional(),
    courseShowcaseIntroTitle: z.string().optional(),
    courseShowcaseIntroTitleVi: z.string().optional(),
    courseShowcaseIntroBody1: z.string().optional(),
    courseShowcaseIntroBody1Vi: z.string().optional(),
    courseShowcaseIntroBody2: z.string().optional(),
    courseShowcaseIntroBody2Vi: z.string().optional(),
    courseShowcaseIntroBody3: z.string().optional(),
    courseShowcaseIntroBody3Vi: z.string().optional(),
    faviconUrl: optionalUrl,
    footerText: z.string().optional(),
    footerTextVi: z.string().optional(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    enableDarkMode: z.boolean().default(true)
  })
});
