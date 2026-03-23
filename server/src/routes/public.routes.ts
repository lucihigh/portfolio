import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getPublicData, submitPublicTestimonial } from "../controllers/public.controller.js";
import { uploadPublicAvatar } from "../controllers/upload.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { publicTestimonialSchema } from "../validators/public.js";
import { uploadAvatar } from "../middleware/upload-avatar.js";

const router = Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." }
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many uploads. Please try again later." }
});

router.get("/", asyncHandler(getPublicData));
router.post("/avatar-upload", uploadLimiter, uploadAvatar, asyncHandler(uploadPublicAvatar));
router.post(
  "/testimonials",
  feedbackLimiter,
  validate(publicTestimonialSchema),
  asyncHandler(submitPublicTestimonial)
);

export default router;
