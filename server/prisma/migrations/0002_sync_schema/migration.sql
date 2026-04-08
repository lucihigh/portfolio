-- Bring the original init migration in sync with the current Prisma schema.

ALTER TABLE "Profile"
  ADD COLUMN IF NOT EXISTS "headlineVi" TEXT,
  ADD COLUMN IF NOT EXISTS "shortBioVi" TEXT,
  ADD COLUMN IF NOT EXISTS "aboutVi" TEXT,
  ADD COLUMN IF NOT EXISTS "strengthsVi" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "careerGoalsVi" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "heroPrimaryLabelVi" TEXT,
  ADD COLUMN IF NOT EXISTS "heroSecondaryLabelVi" TEXT;

ALTER TABLE "Skill"
  ADD COLUMN IF NOT EXISTS "nameVi" TEXT,
  ADD COLUMN IF NOT EXISTS "categoryVi" TEXT,
  ADD COLUMN IF NOT EXISTS "levelVi" TEXT,
  ADD COLUMN IF NOT EXISTS "descriptionVi" TEXT;

ALTER TABLE "Activity"
  ADD COLUMN IF NOT EXISTS "titleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "organizationVi" TEXT,
  ADD COLUMN IF NOT EXISTS "descriptionVi" TEXT,
  ADD COLUMN IF NOT EXISTS "roleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "highlightsVi" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "titleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "descriptionVi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseScore" TEXT,
  ADD COLUMN IF NOT EXISTS "roleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "technologiesVi" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "highlightsVi" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE IF NOT EXISTS "CourseUnit" (
  "id" TEXT NOT NULL,
  "stage" INTEGER,
  "term" TEXT NOT NULL,
  "termVi" TEXT,
  "unitCode" TEXT NOT NULL,
  "unitName" TEXT NOT NULL,
  "unitNameVi" TEXT,
  "credits" INTEGER NOT NULL DEFAULT 15,
  "grade" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Studying',
  "statusVi" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CourseUnit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CourseUnit_unitCode_key" ON "CourseUnit"("unitCode");

ALTER TABLE "Achievement"
  ADD COLUMN IF NOT EXISTS "titleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "issuerVi" TEXT,
  ADD COLUMN IF NOT EXISTS "descriptionVi" TEXT;

ALTER TABLE "Testimonial"
  ADD COLUMN IF NOT EXISTS "roleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "companyVi" TEXT,
  ADD COLUMN IF NOT EXISTS "contentVi" TEXT;

ALTER TABLE "ContactLink"
  ADD COLUMN IF NOT EXISTS "platformVi" TEXT,
  ADD COLUMN IF NOT EXISTS "labelVi" TEXT;

ALTER TABLE "SiteSetting"
  ADD COLUMN IF NOT EXISTS "siteTitleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "siteDescriptionVi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseEyebrow" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseEyebrowVi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseTitleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroTitleVi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroBody1" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroBody1Vi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroBody2" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroBody2Vi" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroBody3" TEXT,
  ADD COLUMN IF NOT EXISTS "courseShowcaseIntroBody3Vi" TEXT,
  ADD COLUMN IF NOT EXISTS "footerTextVi" TEXT;
