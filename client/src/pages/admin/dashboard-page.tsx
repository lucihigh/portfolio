import { useQuery } from "@tanstack/react-query";
import { BookOpen, FolderKanban, Link2, Quote, Sparkles, Trophy, User } from "lucide-react";
import { adminApi, publicApi } from "../../lib/api";
import { AdminPageShell } from "../../components/admin/admin-page-shell";
import { StatCard } from "../../components/admin/stat-card";
import { Card } from "../../components/ui/card";
import { useLocale } from "../../contexts/locale-context";
import { PublicData, Profile, SiteSetting } from "../../types";

export const DashboardPage = () => {
  const { t } = useLocale();
  const { data: publicData } = useQuery({
    queryKey: ["public-data", "admin-preview"],
    queryFn: async () => {
      const response = await publicApi.get<{ data: PublicData }>("/public");
      return response.data.data;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: Profile | null }>("/profile");
      return response.data.data;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await adminApi.get<{ data: SiteSetting | null }>("/settings");
      return response.data.data;
    }
  });

  return (
    <AdminPageShell
      title={t("Dashboard")}
      description={t("Quick overview of what is live on your portfolio and what you can update next.")}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label={t("Skills")} value={publicData?.skills.length || 0} icon={Sparkles} />
        <StatCard label={t("Activities")} value={publicData?.activities.length || 0} icon={Trophy} />
        <StatCard label={t("Projects")} value={publicData?.projects.length || 0} icon={FolderKanban} />
        <StatCard label={t("Course Units")} value={publicData?.courseUnits.length || 0} icon={BookOpen} />
        <StatCard label={t("Achievements")} value={publicData?.achievements.length || 0} icon={Trophy} />
        <StatCard label={t("Testimonials")} value={publicData?.testimonials.length || 0} icon={Quote} />
        <StatCard label={t("Contact")} value={publicData?.contacts.length || 0} icon={Link2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <p className="text-sm uppercase tracking-[0.2em] text-teal-600">{t("Live Profile")}</p>
          <h3 className="mt-4 font-display text-2xl font-bold text-slate-950 dark:text-white">
            {profile?.fullName || t("No profile yet")}
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {profile?.headline ? t(profile.headline) : t("Start by filling in your profile details")}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {profile?.shortBio ? t(profile.shortBio) : t("Your public introduction will appear here once it is saved.")}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("Site Settings")}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{settings?.siteTitle ? t(settings.siteTitle) : t("Untitled site")}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>{t("SEO Description: ")}{settings?.siteDescription ? t(settings.siteDescription) : t("No description configured yet.")}</p>
            <p>{t("Dark Mode Enabled: ")}{settings?.enableDarkMode ? t("Yes") : t("No")}</p>
            <p>{t("Footer: ")}{settings?.footerText ? t(settings.footerText) : t("Not configured")}</p>
          </div>
        </Card>
      </div>
    </AdminPageShell>
  );
};
