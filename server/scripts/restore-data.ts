import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "../src/lib/prisma.js";

type BackupPayload = {
  data: {
    adminUsers: Array<Record<string, unknown>>;
    profiles: Array<Record<string, unknown>>;
    skills: Array<Record<string, unknown>>;
    activities: Array<Record<string, unknown>>;
    projects: Array<Record<string, unknown>>;
    courseUnits: Array<Record<string, unknown>>;
    achievements: Array<Record<string, unknown>>;
    testimonials: Array<Record<string, unknown>>;
    contactLinks: Array<Record<string, unknown>>;
    siteSettings: Array<Record<string, unknown>>;
  };
};

const inputArg = process.argv[2];

if (!inputArg) {
  console.error("Usage: npm run restore:data -- <backup-file>");
  process.exit(1);
}

function normalizeRecords<T extends Record<string, unknown>>(records: T[]) {
  return records.map((record) => ({
    ...record,
    createdAt: record.createdAt ? new Date(String(record.createdAt)) : undefined,
    updatedAt: record.updatedAt ? new Date(String(record.updatedAt)) : undefined,
    startDate: record.startDate ? new Date(String(record.startDate)) : undefined,
    endDate: record.endDate ? new Date(String(record.endDate)) : undefined,
    date: record.date ? new Date(String(record.date)) : undefined
  }));
}

async function main() {
  const inputPath = resolve(process.cwd(), inputArg);
  const raw = await readFile(inputPath, "utf8");
  const payload = JSON.parse(raw) as BackupPayload;

  const adminUsers = normalizeRecords(payload.data.adminUsers);
  const profiles = normalizeRecords(payload.data.profiles);
  const skills = normalizeRecords(payload.data.skills);
  const activities = normalizeRecords(payload.data.activities);
  const projects = normalizeRecords(payload.data.projects);
  const courseUnits = normalizeRecords(payload.data.courseUnits);
  const achievements = normalizeRecords(payload.data.achievements);
  const testimonials = normalizeRecords(payload.data.testimonials);
  const contactLinks = normalizeRecords(payload.data.contactLinks);
  const siteSettings = normalizeRecords(payload.data.siteSettings);

  await prisma.$transaction(async (tx) => {
    await tx.adminUser.deleteMany();
    await tx.profile.deleteMany();
    await tx.skill.deleteMany();
    await tx.activity.deleteMany();
    await tx.project.deleteMany();
    await tx.courseUnit.deleteMany();
    await tx.achievement.deleteMany();
    await tx.testimonial.deleteMany();
    await tx.contactLink.deleteMany();
    await tx.siteSetting.deleteMany();

    if (adminUsers.length > 0) {
      await tx.adminUser.createMany({ data: adminUsers as never[] });
    }
    if (profiles.length > 0) {
      await tx.profile.createMany({ data: profiles as never[] });
    }
    if (skills.length > 0) {
      await tx.skill.createMany({ data: skills as never[] });
    }
    if (activities.length > 0) {
      await tx.activity.createMany({ data: activities as never[] });
    }
    if (projects.length > 0) {
      await tx.project.createMany({ data: projects as never[] });
    }
    if (courseUnits.length > 0) {
      await tx.courseUnit.createMany({ data: courseUnits as never[] });
    }
    if (achievements.length > 0) {
      await tx.achievement.createMany({ data: achievements as never[] });
    }
    if (testimonials.length > 0) {
      await tx.testimonial.createMany({ data: testimonials as never[] });
    }
    if (contactLinks.length > 0) {
      await tx.contactLink.createMany({ data: contactLinks as never[] });
    }
    if (siteSettings.length > 0) {
      await tx.siteSetting.createMany({ data: siteSettings as never[] });
    }
  });

  console.log(`Restore completed from: ${inputPath}`);
}

main()
  .catch((error) => {
    console.error("Restore failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
