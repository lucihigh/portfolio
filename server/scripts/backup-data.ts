import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { prisma } from "../src/lib/prisma.js";

const outputArg = process.argv[2] ?? "../backups/portfolio-data.latest.json";
const outputPath = resolve(process.cwd(), outputArg);

async function main() {
  const [
    adminUsers,
    profiles,
    skills,
    activities,
    projects,
    courseUnits,
    achievements,
    testimonials,
    contactLinks,
    siteSettings
  ] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.profile.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.activity.findMany({ orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.project.findMany({ orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.courseUnit.findMany({ orderBy: [{ sortOrder: "asc" }, { term: "asc" }, { unitCode: "asc" }] }),
    prisma.achievement.findMany({ orderBy: [{ date: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.contactLink.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.siteSetting.findMany({ orderBy: { createdAt: "asc" } })
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    source: "portfolio-server",
    counts: {
      adminUsers: adminUsers.length,
      profiles: profiles.length,
      skills: skills.length,
      activities: activities.length,
      projects: projects.length,
      courseUnits: courseUnits.length,
      achievements: achievements.length,
      testimonials: testimonials.length,
      contactLinks: contactLinks.length,
      siteSettings: siteSettings.length
    },
    data: {
      adminUsers,
      profiles,
      skills,
      activities,
      projects,
      courseUnits,
      achievements,
      testimonials,
      contactLinks,
      siteSettings
    }
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Backup completed: ${outputPath}`);
}

main()
  .catch((error) => {
    console.error("Backup failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
