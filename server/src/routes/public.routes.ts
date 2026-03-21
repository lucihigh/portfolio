import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getPublicData, submitPublicTestimonial } from "../controllers/public.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { publicTestimonialSchema } from "../validators/public.js";

const router = Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." }
});

router.get("/", asyncHandler(getPublicData));
router.post(
  "/testimonials",
  feedbackLimiter,
  validate(publicTestimonialSchema),
  asyncHandler(submitPublicTestimonial)
);

export default router;
