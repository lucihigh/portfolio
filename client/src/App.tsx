import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/admin/protected-route";
import { AdminLayout } from "./components/admin/admin-layout";
import { DashboardPage } from "./pages/admin/dashboard-page";
import { LoginPage } from "./pages/admin/login-page";
import { ProfilePage } from "./pages/admin/profile-page";
import { SkillsPage } from "./pages/admin/skills-page";
import { ActivitiesPage } from "./pages/admin/activities-page";
import { ProjectsPage } from "./pages/admin/projects-page";
import { AchievementsPage } from "./pages/admin/achievements-page";
import { TestimonialsPage } from "./pages/admin/testimonials-page";
import { ContactsPage } from "./pages/admin/contacts-page";
import { SettingsPage } from "./pages/admin/settings-page";
import { HomePage } from "./pages/public/home-page";
import { FeedbackPage } from "./pages/public/feedback-page";

export default function App() {
  return (
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
  );
}
