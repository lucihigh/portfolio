import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/admin/protected-route";

const AdminLayout = lazy(async () => {
  const module = await import("./components/admin/admin-layout");
  return { default: module.AdminLayout };
});

const DashboardPage = lazy(async () => {
  const module = await import("./pages/admin/dashboard-page");
  return { default: module.DashboardPage };
});

const LoginPage = lazy(async () => {
  const module = await import("./pages/admin/login-page");
  return { default: module.LoginPage };
});

const ProfilePage = lazy(async () => {
  const module = await import("./pages/admin/profile-page");
  return { default: module.ProfilePage };
});

const SkillsPage = lazy(async () => {
  const module = await import("./pages/admin/skills-page");
  return { default: module.SkillsPage };
});

const ActivitiesPage = lazy(async () => {
  const module = await import("./pages/admin/activities-page");
  return { default: module.ActivitiesPage };
});

const ProjectsPage = lazy(async () => {
  const module = await import("./pages/admin/projects-page");
  return { default: module.ProjectsPage };
});

const AchievementsPage = lazy(async () => {
  const module = await import("./pages/admin/achievements-page");
  return { default: module.AchievementsPage };
});

const TestimonialsPage = lazy(async () => {
  const module = await import("./pages/admin/testimonials-page");
  return { default: module.TestimonialsPage };
});

const ContactsPage = lazy(async () => {
  const module = await import("./pages/admin/contacts-page");
  return { default: module.ContactsPage };
});

const SettingsPage = lazy(async () => {
  const module = await import("./pages/admin/settings-page");
  return { default: module.SettingsPage };
});

const HomePage = lazy(async () => {
  const module = await import("./pages/public/home-page");
  return { default: module.HomePage };
});

const FeedbackPage = lazy(async () => {
  const module = await import("./pages/public/feedback-page");
  return { default: module.FeedbackPage };
});

const RouteFallback = () => <div className="min-h-screen bg-white dark:bg-slate-950" />;

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="course-units" element={<Navigate to="/admin/projects" replace />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
