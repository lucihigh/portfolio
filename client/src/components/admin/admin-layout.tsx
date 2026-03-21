import { Menu, LogOut, LayoutDashboard, User, Sparkles, Trophy, FolderKanban, Quote, Link2, Settings } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "../ui/button";
import { LanguageToggle } from "../ui/language-toggle";
import { ThemeToggle } from "../ui/theme-toggle";
import { cn } from "../../lib/utils";
import { useLocale } from "../../contexts/locale-context";
import { useThemeMode } from "../../hooks/use-theme-mode";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/activities", label: "Activities", icon: Trophy },
  { to: "/admin/projects", label: "Course Showcase", icon: FolderKanban },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/contacts", label: "Contacts", icon: Link2 },
  { to: "/admin/settings", label: "Settings", icon: Settings }
];

export const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useThemeMode();
  const { locale, toggleLocale, t } = useLocale();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r-[3px] border-slate-950 bg-[#fffdf5] p-6 transition dark:border-cyan-100 dark:bg-slate-950 lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-600" style={{ fontFamily: '"Pixelify Sans", monospace' }}>
                {t("Portfolio CMS")}
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">
                {t("Admin Console")}
              </h1>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="pixel-dot" />
            <span className="pixel-chip">{t("Pixel Control Mode")}</span>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-none border-[3px] px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "border-slate-950 bg-cyan-400 text-slate-950 shadow-pixel dark:border-cyan-100 dark:bg-cyan-300"
                        : "border-transparent text-slate-700 hover:border-slate-950 hover:bg-white hover:shadow-[6px_6px_0_0_rgba(15,23,42,0.18)] dark:text-slate-300 dark:hover:border-cyan-100 dark:hover:bg-slate-900 dark:hover:text-white"
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.label)}
                </NavLink>
              );
            })}
          </nav>

          <div className="pixel-surface mt-8 rounded-[1.25rem] bg-white p-4 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.fullName || user?.email}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            <Button className="mt-4 w-full" variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("Logout")}
            </Button>
          </div>
        </aside>

        {open ? (
          <button
            className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
        ) : null}

        <main className="flex-1 px-4 py-4 lg:px-8 lg:py-6">
          <div className="pixel-surface mb-6 flex items-center justify-between rounded-[1.25rem] bg-white px-4 py-4 dark:bg-slate-900">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-600" style={{ fontFamily: '"Pixelify Sans", monospace' }}>{t("Manage your portfolio content")}</p>
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                {t("Control Center")}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle locale={locale} onToggle={toggleLocale} />
              <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
              <Button variant="outline" className="lg:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
