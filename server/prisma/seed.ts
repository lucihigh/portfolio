import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";

  const passwordHash = await hashPassword(adminPassword);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      fullName: "Portfolio Admin"
    },
    create: {
      email: adminEmail,
      passwordHash,
      fullName: "Portfolio Admin"
    }
  });

  const [
    profileCount,
    skillCount,
    activityCount,
    courseUnitCount,
    achievementCount,
    testimonialCount,
    contactCount,
    settingCount
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.skill.count(),
    prisma.activity.count(),
    prisma.courseUnit.count(),
    prisma.achievement.count(),
    prisma.testimonial.count(),
    prisma.contactLink.count(),
    prisma.siteSetting.count()
  ]);

  if (profileCount === 0) {
    await prisma.profile.create({
      data: {
        fullName: "Le Danh Dat",
        headline: "Fullstack Developer | IT Student | Tech Competition Enthusiast",
        shortBio:
          "I build polished web experiences, enjoy solving real-world problems, and love growing through competitions, teamwork, and continuous learning.",
        about:
          "I am an energetic IT student focused on fullstack development, practical product building, and strong collaboration. I enjoy turning ideas into maintainable software, joining hackathons, and learning from mentors and teammates through real projects.",
        strengths: [
          "Strong ownership from idea to deployment",
          "Comfortable across frontend, backend, and database work",
          "Good teamwork, communication, and self-learning mindset"
        ],
        careerGoals: [
          "Grow into a professional fullstack engineer",
          "Contribute to meaningful digital products used by real people",
          "Keep improving in system design, product thinking, and leadership"
        ],
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
        cvUrl: "https://example.com/demo-cv.pdf",
        email: "dat.dev@example.com",
        phone: "+84 912 345 678",
        location: "Ho Chi Minh City, Vietnam",
        githubUrl: "https://github.com/example",
        linkedinUrl: "https://linkedin.com/in/example",
        facebookUrl: "https://facebook.com/example",
        heroPrimaryLabel: "View Projects",
        heroPrimaryHref: "#projects",
        heroSecondaryLabel: "Contact Me",
        heroSecondaryHref: "#contact"
      }
    });
  }

  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
      { name: "React", category: "Frontend", level: "Advanced", sortOrder: 1 },
      { name: "TypeScript", category: "Frontend", level: "Advanced", sortOrder: 2 },
      { name: "Tailwind CSS", category: "Frontend", level: "Advanced", sortOrder: 3 },
      { name: "Node.js", category: "Backend", level: "Advanced", sortOrder: 1 },
      { name: "Express", category: "Backend", level: "Advanced", sortOrder: 2 },
      { name: "Prisma", category: "Database", level: "Intermediate", sortOrder: 1 },
      { name: "PostgreSQL", category: "Database", level: "Intermediate", sortOrder: 2 },
      { name: "Git & GitHub", category: "Tools", level: "Advanced", sortOrder: 1 },
      { name: "Docker", category: "Tools", level: "Intermediate", sortOrder: 2 },
      { name: "Teamwork", category: "Soft skills", level: "Strong", sortOrder: 1 },
      { name: "Leadership", category: "Soft skills", level: "Strong", sortOrder: 2 }
      ]
    });
  }

  if (activityCount === 0) {
    await prisma.activity.createMany({
      data: [
      {
        title: "National Student Hackathon",
        organization: "Vietnam Tech Youth",
        slug: "national-student-hackathon",
        description:
          "Worked with a cross-functional team to prototype a smart campus solution and present the product to judges in the final round.",
        role: "Fullstack Developer",
        startDate: new Date("2025-09-10T00:00:00.000Z"),
        endDate: new Date("2025-09-12T00:00:00.000Z"),
        location: "Da Nang",
        highlights: ["Built MVP in 48 hours", "Led API integration", "Demoed the final product"],
        sortOrder: 1
      },
      {
        title: "University Developer Club",
        organization: "Faculty of Information Technology",
        slug: "university-developer-club",
        description:
          "Supported workshops, mentored junior members, and coordinated community coding sessions around frontend and backend fundamentals.",
        role: "Core Member",
        startDate: new Date("2024-10-01T00:00:00.000Z"),
        location: "Ho Chi Minh City",
        highlights: ["Hosted weekly sharing sessions", "Mentored freshmen", "Built club landing page"],
        sortOrder: 2
      },
      {
        title: "Robocon Research Team",
        organization: "Engineering Innovation Lab",
        slug: "robocon-research-team",
        description:
          "Collaborated with teammates on software integration, testing workflows, and competition preparation for a student robotics team.",
        role: "Software Support",
        startDate: new Date("2024-03-01T00:00:00.000Z"),
        endDate: new Date("2024-08-20T00:00:00.000Z"),
        location: "Ho Chi Minh City",
        highlights: ["Improved testing discipline", "Coordinated cross-team progress", "Presented technical updates"],
        sortOrder: 3
      }
      ]
    });
  }

  if (achievementCount === 0) {
    await prisma.achievement.createMany({
      data: [
      {
        title: "Top 5 Finalist - Smart Campus Hackathon",
        issuer: "Vietnam Tech Youth",
        description:
          "Reached the final round with a campus digital product prototype focused on student engagement and event discovery.",
        date: new Date("2025-09-12T00:00:00.000Z"),
        sortOrder: 1
      },
      {
        title: "Best Team Collaboration Award",
        issuer: "University Developer Club",
        description:
          "Recognized for consistent collaboration, mentoring support, and contribution to club technical activities.",
        date: new Date("2025-05-20T00:00:00.000Z"),
        sortOrder: 2
      },
      {
        title: "Fullstack Web Development Certificate",
        issuer: "Online Learning Platform",
        description:
          "Completed a structured learning path covering frontend, backend, database design, and deployment best practices.",
        date: new Date("2024-12-15T00:00:00.000Z"),
        credentialUrl: "https://example.com/certificate/fullstack",
        sortOrder: 3
      }
      ]
    });
  }

  if (courseUnitCount === 0) {
    await prisma.courseUnit.createMany({
      data: [
        { stage: 1, term: "Summer 2024", unitCode: "7388", unitName: "Programming", credits: 15, grade: "D", status: "Passed", sortOrder: 1 },
        { stage: 1, term: "Summer 2024", unitCode: "7393", unitName: "Networking", credits: 15, grade: "M", status: "Passed", sortOrder: 2 },
        { stage: 2, term: "Fall 2024", unitCode: "7398", unitName: "Professional Practice", credits: 15, grade: "D", status: "Passed", sortOrder: 3 },
        { stage: 2, term: "Fall 2024", unitCode: "7407", unitName: "Planning a Computing Project", credits: 15, grade: "M", status: "Passed", sortOrder: 4 },
        { stage: 2, term: "Fall 2024", unitCode: "7400", unitName: "Database Design & Development", credits: 15, grade: "M", status: "Passed", sortOrder: 5 },
        { stage: 3, term: "Spring 2025", unitCode: "7430", unitName: "Data Structures & Algorithms", credits: 15, grade: "M", status: "Passed", sortOrder: 6 },
        { stage: 3, term: "Spring 2025", unitCode: "7481", unitName: "Internet of Things", credits: 15, grade: "M", status: "Passed", sortOrder: 7 },
        { stage: 3, term: "Spring 2025", unitCode: "7406", unitName: "Security", credits: 15, grade: "M", status: "Passed", sortOrder: 8 },
        { stage: 4, term: "Summer 2025", unitCode: "7408", unitName: "Software Development Life Cycle", credits: 15, grade: "D", status: "Passed", sortOrder: 9 },
        { stage: 4, term: "Summer 2025", unitCode: "7419", unitName: "Website Design & Development", credits: 15, grade: "D", status: "Passed", sortOrder: 10 },
        { stage: 4, term: "Summer 2025", unitCode: "7428", unitName: "Business Process Support", credits: 15, grade: "D", status: "Passed", sortOrder: 11 },
        { stage: 5, term: "Fall 2025", unitCode: "4902", unitName: "Applied Programming and Design Principles", credits: 15, grade: "D", status: "Passed", sortOrder: 12 },
        { stage: 5, term: "Fall 2025", unitCode: "7436", unitName: "Application Development", credits: 15, grade: "D", status: "Passed", sortOrder: 13 },
        { stage: 5, term: "Fall 2025", unitCode: "7429", unitName: "Discrete Maths", credits: 15, grade: "D", status: "Passed", sortOrder: 14 },
        { stage: 6, term: "Current", unitCode: "7425", unitName: "Computer Research Project (Pearson Set)", credits: 15, grade: "", status: "Studying", sortOrder: 15 }
      ]
    });
  }

  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
      {
        name: "Nguyen Minh Khoa",
        role: "Lecturer",
        company: "Faculty of IT",
        content:
          "Dat is proactive, reliable, and learns quickly. He consistently delivers practical solutions and communicates clearly during team work.",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        sortOrder: 1
      },
      {
        name: "Tran Bao Linh",
        role: "Teammate",
        company: "Hackathon Team",
        content:
          "Working with Dat was smooth and motivating. He handled both product details and technical issues calmly under tight deadlines.",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        sortOrder: 2
      },
      {
        name: "Pham Gia Huy",
        role: "Club Mentor",
        company: "Developer Club",
        content:
          "He combines a strong self-learning attitude with a willingness to support others, which makes him stand out in collaborative environments.",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        sortOrder: 3
      }
      ]
    });
  }

  if (contactCount === 0) {
    await prisma.contactLink.createMany({
      data: [
      {
        platform: "GitHub",
        label: "github.com/example",
        url: "https://github.com/example",
        icon: "github",
        sortOrder: 1
      },
      {
        platform: "LinkedIn",
        label: "linkedin.com/in/example",
        url: "https://linkedin.com/in/example",
        icon: "linkedin",
        sortOrder: 2
      },
      {
        platform: "Facebook",
        label: "facebook.com/example",
        url: "https://facebook.com/example",
        icon: "facebook",
        sortOrder: 3
      },
      {
        platform: "Email",
        label: "dat.dev@example.com",
        url: "mailto:dat.dev@example.com",
        icon: "mail",
        sortOrder: 4
      }
      ]
    });
  }

  if (settingCount === 0) {
    await prisma.siteSetting.create({
      data: {
        siteTitle: "Le Danh Dat | Fullstack Developer Portfolio",
        siteDescription:
          "Professional personal portfolio showcasing projects, achievements, activities, and testimonials of an ambitious IT student and fullstack developer.",
        faviconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bb.svg",
        footerText: "Built with React, Express, Prisma, and a love for continuous improvement.",
        primaryColor: "#0f172a",
        accentColor: "#14b8a6",
        enableDarkMode: true
      }
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
