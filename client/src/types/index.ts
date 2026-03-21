export type Profile = {
  id: string;
  fullName: string;
  headline: string;
  headlineVi?: string | null;
  shortBio: string;
  shortBioVi?: string | null;
  about: string;
  aboutVi?: string | null;
  strengths: string[];
  strengthsVi: string[];
  careerGoals: string[];
  careerGoalsVi: string[];
  avatarUrl?: string | null;
  cvUrl?: string | null;
  email: string;
  phone?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  heroPrimaryLabel: string;
  heroPrimaryLabelVi?: string | null;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryLabelVi?: string | null;
  heroSecondaryHref: string;
  isPublished: boolean;
};

export type Skill = {
  id: string;
  name: string;
  nameVi?: string | null;
  category: string;
  categoryVi?: string | null;
  level?: string | null;
  levelVi?: string | null;
  description?: string | null;
  descriptionVi?: string | null;
  icon?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type Activity = {
  id: string;
  title: string;
  titleVi?: string | null;
  organization: string;
  organizationVi?: string | null;
  slug: string;
  description: string;
  descriptionVi?: string | null;
  role?: string | null;
  roleVi?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  highlights: string[];
  highlightsVi: string[];
  imageUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type Project = {
  id: string;
  title: string;
  titleVi?: string | null;
  slug: string;
  description: string;
  descriptionVi?: string | null;
  courseScore?: string | null;
  role?: string | null;
  roleVi?: string | null;
  imageUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  technologies: string[];
  technologiesVi: string[];
  highlights: string[];
  highlightsVi: string[];
  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  titleVi?: string | null;
  issuer?: string | null;
  issuerVi?: string | null;
  description: string;
  descriptionVi?: string | null;
  date?: string | null;
  imageUrl?: string | null;
  credentialUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type CourseUnit = {
  id: string;
  stage?: number | null;
  term: string;
  termVi?: string | null;
  unitCode: string;
  unitName: string;
  unitNameVi?: string | null;
  credits: number;
  grade?: string | null;
  status: string;
  statusVi?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  roleVi?: string | null;
  company?: string | null;
  companyVi?: string | null;
  content: string;
  contentVi?: string | null;
  avatarUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type ContactLink = {
  id: string;
  platform: string;
  platformVi?: string | null;
  label: string;
  labelVi?: string | null;
  url: string;
  icon?: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type SiteSetting = {
  id: string;
  siteTitle: string;
  siteTitleVi?: string | null;
  siteDescription: string;
  siteDescriptionVi?: string | null;
  courseShowcaseEyebrow?: string | null;
  courseShowcaseEyebrowVi?: string | null;
  courseShowcaseTitle?: string | null;
  courseShowcaseTitleVi?: string | null;
  courseShowcaseIntroTitle?: string | null;
  courseShowcaseIntroTitleVi?: string | null;
  courseShowcaseIntroBody1?: string | null;
  courseShowcaseIntroBody1Vi?: string | null;
  courseShowcaseIntroBody2?: string | null;
  courseShowcaseIntroBody2Vi?: string | null;
  courseShowcaseIntroBody3?: string | null;
  courseShowcaseIntroBody3Vi?: string | null;
  faviconUrl?: string | null;
  footerText?: string | null;
  footerTextVi?: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
  enableDarkMode: boolean;
};

export type PublicData = {
  profile: Profile | null;
  skills: Skill[];
  activities: Activity[];
  projects: Project[];
  courseUnits: CourseUnit[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  contacts: ContactLink[];
  settings: SiteSetting | null;
};

export type AdminAuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName?: string | null;
  };
};
