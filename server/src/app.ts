import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import projectRoutes from "./routes/project.routes.js";
import courseUnitRoutes from "./routes/course-unit.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import { authenticate } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export const app = express();
const currentDir = fileURLToPath(new URL(".", import.meta.url));
const uploadsDir = resolve(currentDir, "../uploads");

app.use(
  cors({
    origin: [env.CLIENT_URL],
    credentials: true
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);

app.use("/api/profile", authenticate, profileRoutes);
app.use("/api/skills", authenticate, skillRoutes);
app.use("/api/activities", authenticate, activityRoutes);
app.use("/api/projects", authenticate, projectRoutes);
app.use("/api/course-units", authenticate, courseUnitRoutes);
app.use("/api/achievements", authenticate, achievementRoutes);
app.use("/api/testimonials", authenticate, testimonialRoutes);
app.use("/api/contacts", authenticate, contactRoutes);
app.use("/api/settings", authenticate, settingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
