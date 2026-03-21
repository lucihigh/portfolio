import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fullName = "L\u00ea Danh \u0110\u1ea1t";
const siteTitle = "L\u00ea Danh \u0110\u1ea1t | Fullstack Developer Portfolio";

async function main() {
  await prisma.profile.updateMany({
    data: { fullName }
  });

  await prisma.siteSetting.updateMany({
    data: { siteTitle }
  });

  const profile = await prisma.profile.findFirst({
    select: { fullName: true }
  });

  const setting = await prisma.siteSetting.findFirst({
    select: { siteTitle: true }
  });

  console.log(JSON.stringify({ profile, setting }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
