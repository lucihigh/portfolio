import { ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  RefreshCw
} from "lucide-react";
import { publicApi } from "../../lib/api";
import { Activity, ContactLink, PublicData } from "../../types";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { LanguageToggle } from "../../components/ui/language-toggle";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useLocale } from "../../contexts/locale-context";
import { useThemeMode } from "../../hooks/use-theme-mode";
import { DEFAULT_TESTIMONIAL_AVATAR, formatDate, normalizeMediaUrl } from "../../lib/format";
import { localizeList, localizeText } from "../../lib/localized";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  mail: Mail
};

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const courseImageFallbacks = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
] as const;

const projectCourseAliases: Record<string, string[]> = {
  "Web Programming": ["Web Programming", "Website Design & Development"],
  "Frontend Development": ["Application Development", "Website Design & Development"],
  "Software Engineering": ["Software Development Life Cycle", "Planning a Computing Project"]
};

const normalizeLookup = (value?: string | null) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const HomePage = () => {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["public-data"],
    queryFn: async () => {
      const response = await publicApi.get<{ data: PublicData }>("/public");
      return response.data.data;
    },
    retry: 1,
    retryDelay: 3000
  });

  const { darkMode, toggleTheme } = useThemeMode();
  const { locale, toggleLocale, t } = useLocale();

  useEffect(() => {
    if (!data?.settings?.faviconUrl) return;
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = normalizeMediaUrl(data.settings.faviconUrl);
  }, [data?.settings?.faviconUrl]);

  useEffect(() => {
    if (!data?.settings) return;
    document.title = localizeText(locale, data.settings.siteTitle, data.settings.siteTitleVi) || "Portfolio";
    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", localizeText(locale, data.settings.siteDescription, data.settings.siteDescriptionVi) || "Professional portfolio");
  }, [data?.settings, locale, t]);

  const groupedSkills = useMemo(() => {
    const groups = new Map<string, PublicData["skills"]>();
    data?.skills.forEach((skill) => {
      groups.set(skill.category, [...(groups.get(skill.category) || []), skill]);
    });
    return Array.from(groups.entries());
  }, [data?.skills]);

  const courseCards = useMemo(() => {
    const projectByUnitName = new Map<string, NonNullable<PublicData["projects"]>[number]>();

    data?.projects?.forEach((project) => {
      const aliases = projectCourseAliases[project.title] || [project.title];
      aliases.forEach((alias) => {
        projectByUnitName.set(normalizeLookup(alias), project);
      });
    });

    return (data?.courseUnits || []).map((unit, index) => {
      const linkedProject = projectByUnitName.get(normalizeLookup(unit.unitName));
      const coverImage =
        normalizeMediaUrl(linkedProject?.imageUrl) || courseImageFallbacks[index % courseImageFallbacks.length];
      const technologies =
        linkedProject?.technologies.length
          ? localizeList(locale, linkedProject.technologies, linkedProject.technologiesVi)
          : [unit.term, `Stage ${unit.stage ?? "-"}`, `${unit.credits} credits`, unit.status];

      return { unit, linkedProject, coverImage, technologies };
    });
  }, [data?.courseUnits, data?.projects, locale]);

  const visibleCourseCards = showAllCourses ? courseCards : courseCards.slice(0, 2);

  if (isLoading) {
    return (
      <div className="container-shell flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-xl overflow-hidden text-center">
          <div className="relative">
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            />
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-cyan-200/60 bg-cyan-50/80 px-4 py-2 dark:border-cyan-400/20 dark:bg-cyan-400/10">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="h-2.5 w-2.5 rounded-full bg-cyan-500"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: index * 0.16, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.24em] text-teal-600">{t("Loading")}</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">
            {t("Preparing your portfolio experience...")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
            {t("This website is publicly hosted on Render, so the first request may take up to 1 minute while the server wakes up.")}
          </p>
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    const message =
      (error as { message?: string } | null)?.message ||
      "The client could not load portfolio data from the API.";

    return (
      <div className="container-shell flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-600">{t("API unavailable")}</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">
            {t("The portfolio server is not responding yet.")}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {t("If you are using Render free services, the backend or database may still be waking up. Wait a bit, then try again.")}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isFetching ? t("Retrying...") : t("Try again")}
            </Button>
            <Button variant="outline" onClick={() => window.location.assign("/admin/login")}>
              {t("Open admin login")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { profile, settings, activities, achievements, testimonials, contacts } = data;

  return (
    <div className="pb-12">
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="container-shell flex items-center justify-between py-4">
          <a href="#top" className="font-display text-xl font-bold text-slate-950 dark:text-white">
            {profile?.fullName || "Portfolio"}
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#about">{t("About")}</a>
            <a href="#skills">{t("Skills")}</a>
            <a href="#projects">{t("Course Scores")}</a>
            <a href="#testimonials">{t("Feedback")}</a>
            <a href="#contact">{t("Contact")}</a>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle locale={locale} onToggle={toggleLocale} />
            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      <main id="top">
        <section className="container-shell grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <motion.div initial="hidden" animate="visible" variants={sectionVariant} transition={{ duration: 0.6 }}>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge>{t("Available for internships and fulltime opportunities")}</Badge>
              <span className="pixel-chip">Fullstack x Pixel Accent</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              {profile?.fullName}
            </h1>
            <p className="mt-4 text-xl font-semibold text-teal-600">{localizeText(locale, profile?.headline, profile?.headlineVi)}</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {localizeText(locale, profile?.shortBio, profile?.shortBioVi)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => (window.location.hash = (profile?.heroPrimaryHref || "#projects").replace("#", ""))}>
                {localizeText(locale, profile?.heroPrimaryLabel, profile?.heroPrimaryLabelVi)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.hash = (profile?.heroSecondaryHref || "#contact").replace("#", ""))}
              >
                {localizeText(locale, profile?.heroSecondaryLabel, profile?.heroSecondaryLabelVi)}
              </Button>
              {profile?.cvUrl ? (
                <Button variant="ghost" onClick={() => window.open(profile.cvUrl || "", "_blank", "noreferrer")}>
                  <Download className="mr-2 h-4 w-4" />
                  {t("Download CV")}
                </Button>
              ) : null}
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              {profile?.location ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 dark:border-slate-800">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              ) : null}
              {profile?.email ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 dark:border-slate-800">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </span>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-4 top-8 hidden sm:block"
            >
              <span className="pixel-chip">BUILD</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 }}
              className="absolute -right-2 bottom-10 hidden sm:block"
            >
              <span className="pixel-chip bg-amber-300">DEPLOY</span>
            </motion.div>
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-transparent blur-3xl" />
            <Card className="relative overflow-hidden rounded-[2rem] p-4">
              <img
                src={normalizeMediaUrl(profile?.avatarUrl) || "https://via.placeholder.com/600x700"}
                alt={profile?.fullName}
                className="h-[520px] w-full rounded-[1.5rem] object-cover"
              />
            </Card>
          </motion.div>
        </section>

        <Section id="about" eyebrow={t("About Me")} title={t("Building polished digital products with curiosity and consistency.")}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{localizeText(locale, profile?.about, profile?.aboutVi)}</p>
            </Card>
            <div className="grid gap-6">
              <Card>
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">{t("Strengths")}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {localizeList(locale, profile?.strengths, profile?.strengthsVi).map((item) => (
                    <li key={item}>- {t(item)}</li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">{t("Career Goals")}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {localizeList(locale, profile?.careerGoals, profile?.careerGoalsVi).map((item) => (
                    <li key={item}>- {t(item)}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Section>

        <Section id="skills" eyebrow={t("Skills")} title={t("Balanced across product thinking, frontend polish, and backend reliability.")}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groupedSkills.map(([category, skills]) => (
              <Card key={category}>
                <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{t(category)}</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <Badge key={skill.id} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {t(skill.name)}
                      {skill.level ? ` | ${t(skill.level)}` : ""}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="activities" eyebrow={t("Activities")} title={t("Competitions, clubs, and collaborative experiences that shaped my journey.")}>
          <div className="relative space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-700">
            {activities.map((activity: Activity, index) => (
              <motion.div
                key={activity.id}
                initial={false}
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariant}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="relative pl-12"
              >
                <span className="absolute left-0 top-6 h-8 w-8 rounded-full border-4 border-white bg-teal-500 dark:border-slate-950" />
                <Card>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{localizeText(locale, activity.title, activity.titleVi)}</h3>
                      <p className="mt-2 text-sm font-semibold text-teal-600">
                        {localizeText(locale, activity.organization, activity.organizationVi)}
                        {activity.role ? ` | ${localizeText(locale, activity.role, activity.roleVi)}` : ""}
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{localizeText(locale, activity.description, activity.descriptionVi)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {localizeList(locale, activity.highlights, activity.highlightsVi).map((item) => (
                      <Badge key={item}>{t(item)}</Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          id="projects"
          eyebrow={localizeText(locale, settings?.courseShowcaseEyebrow, settings?.courseShowcaseEyebrowVi) || t("Course Showcase")}
          title={
            localizeText(locale, settings?.courseShowcaseTitle, settings?.courseShowcaseTitleVi) ||
            t("Each subject gets its own showcase card with grades, coursework details, and product links.")
          }
        >
          <Card className="mb-8">
            <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              {localizeText(locale, settings?.courseShowcaseIntroTitle, settings?.courseShowcaseIntroTitleVi) || t("How grading works")}
            </h3>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-600 dark:text-slate-300 lg:grid-cols-3">
              <p>
                {localizeText(locale, settings?.courseShowcaseIntroBody1, settings?.courseShowcaseIntroBody1Vi) ||
                  t("BTEC FPT evaluates practical performance across each unit, so results reflect assignments, project work, and applied skills instead of only theory exams.")}
              </p>
              <p>
                {localizeText(locale, settings?.courseShowcaseIntroBody2, settings?.courseShowcaseIntroBody2Vi) ||
                  t("Grades are typically grouped into Pass, Merit, and Distinction, with the final classification accumulated from completed units.")}
              </p>
              <p>
                {localizeText(locale, settings?.courseShowcaseIntroBody3, settings?.courseShowcaseIntroBody3Vi) ||
                  t("You can update every card later from admin with the exact score, source code link, live demo, image, and detailed description for that subject.")}
              </p>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {visibleCourseCards.map(({ unit, linkedProject, coverImage, technologies }, index) => (
              <motion.div
                key={unit.id}
                initial={false}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariant}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="h-full overflow-hidden p-0">
                  <img src={coverImage} alt={unit.unitName} className="h-64 w-full object-cover" />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{localizeText(locale, unit.unitName, unit.unitNameVi)}</h3>
                        <p className="mt-2 text-sm font-semibold text-teal-600">
                          {unit.grade
                            ? `${t("Final grade")}: ${unit.grade}`
                            : linkedProject?.courseScore
                              ? `${t("Course score")}: ${linkedProject.courseScore}`
                              : t("Waiting for score update")}
                        </p>
                      </div>
                      <Badge className={unit.grade === "D" ? "bg-amber-100 text-amber-800 dark:bg-amber-300 dark:text-slate-950" : undefined}>
                        {unit.grade || t("Pending")}
                      </Badge>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {localizeText(locale, linkedProject?.description, linkedProject?.descriptionVi) ||
                        (locale === "vi"
                          ? `${unit.unitCode} thuộc ${localizeText(locale, unit.term, unit.termVi)} với ${unit.credits} tín chỉ. ${t("This subject card is ready for you to attach the real course brief, your deliverables, and the final product links later.")}`
                          : `${unit.unitCode} is scheduled in ${unit.term} with ${unit.credits} credits. ${t("This subject card is ready for you to attach the real course brief, your deliverables, and the final product links later.")}`)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                        Stage {unit.stage ?? "-"}
                      </span>
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">{localizeText(locale, unit.term, unit.termVi)}</span>
                      <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">{localizeText(locale, unit.status, unit.statusVi)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {technologies.map((item) => (
                        <Badge key={item} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {t(item)}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {linkedProject?.githubUrl ? (
                        <Button variant="outline" onClick={() => window.open(linkedProject.githubUrl || "", "_blank", "noreferrer")}>
                          <Github className="mr-2 h-4 w-4" />
                          {t("View Code")}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          <Github className="mr-2 h-4 w-4" />
                          {t("Add Code Link Later")}
                        </Button>
                      )}
                      {linkedProject?.demoUrl ? (
                        <Button onClick={() => window.open(linkedProject.demoUrl || "", "_blank", "noreferrer")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t("Run Product")}
                        </Button>
                      ) : (
                        <Button disabled>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t("Demo Coming Soon")}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {courseCards.length > 2 ? (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setShowAllCourses((current) => !current)}>
                {showAllCourses ? t("Show less") : t("Show more subjects")}
              </Button>
            </div>
          ) : null}
        </Section>

        <Section id="achievements" eyebrow={t("Achievements")} title={t("Milestones that reflect progress, persistence, and real participation.")}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
                  {localizeText(locale, achievement.issuer || "Achievement", achievement.issuerVi)}
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold text-slate-950 dark:text-white">{localizeText(locale, achievement.title, achievement.titleVi)}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{localizeText(locale, achievement.description, achievement.descriptionVi)}</p>
                {achievement.date ? (
                  <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{formatDate(achievement.date)}</p>
                ) : null}
              </Card>
            ))}
          </div>
        </Section>

        <Section id="testimonials" eyebrow={t("Testimonials")} title={t("Feedback from mentors, teammates, and collaborators.")}>
          <div className="mb-6 flex justify-end">
            <Button variant="outline" onClick={() => window.location.assign("/feedback")}>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              {t("Leave Feedback")}
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="flex h-full flex-col">
                <p className="flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  "{localizeText(locale, testimonial.content, testimonial.contentVi)}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={normalizeMediaUrl(testimonial.avatarUrl) || DEFAULT_TESTIMONIAL_AVATAR}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = DEFAULT_TESTIMONIAL_AVATAR;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {localizeText(locale, testimonial.role, testimonial.roleVi)}
                      {testimonial.company ? ` | ${localizeText(locale, testimonial.company, testimonial.companyVi)}` : ""}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow={t("Contact")} title={t("Let us build something valuable together.")}>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <p className="inline-flex items-center gap-3">
                  <Mail className="h-4 w-4 text-teal-600" />
                  {profile?.email}
                </p>
                {profile?.phone ? (
                  <p className="inline-flex items-center gap-3">
                    <Phone className="h-4 w-4 text-teal-600" />
                    {profile.phone}
                  </p>
                ) : null}
                {profile?.location ? (
                  <p className="inline-flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    {profile.location}
                  </p>
                ) : null}
              </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((contact: ContactLink) => {
                const Icon = iconMap[(contact.icon?.toLowerCase() || "mail") as keyof typeof iconMap] || ExternalLink;
                return (
                  <button
                    key={contact.id}
                    type="button"
                    className="text-left"
                    onClick={() => window.open(contact.url, "_blank", "noreferrer")}
                  >
                    <Card className="h-full transition hover:-translate-y-1 hover:border-teal-200">
                      <Icon className="h-5 w-5 text-teal-600" />
                      <p className="mt-4 font-semibold text-slate-900 dark:text-white">{localizeText(locale, contact.platform, contact.platformVi)}</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{localizeText(locale, contact.label, contact.labelVi)}</p>
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>
      </main>

      <footer className="container-shell mt-12">
        <Card className="flex flex-col gap-4 rounded-[2rem] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold text-slate-950 dark:text-white">{profile?.fullName}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {localizeText(locale, settings?.footerText || "Professional portfolio website", settings?.footerTextVi)}
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Copyright {new Date().getFullYear()} {profile?.fullName}. {t("All rights reserved.")}
          </p>
        </Card>
      </footer>
    </div>
  );
};

const Section = ({
  id,
  eyebrow,
  title,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) => (
  <motion.section
    id={id}
    className="container-shell py-12 lg:py-16"
    initial={false}
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={sectionVariant}
    transition={{ duration: 0.5 }}
  >
    <p className="section-heading">{eyebrow}</p>
    <h2 className="section-title">{title}</h2>
    <div className="mt-8">{children}</div>
  </motion.section>
);
