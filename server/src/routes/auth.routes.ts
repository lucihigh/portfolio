import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." }
});

router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(login));

export default router;
