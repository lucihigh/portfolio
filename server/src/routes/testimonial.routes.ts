import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial
} from "../controllers/testimonial.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { testimonialSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listTestimonials));
router.post("/", validate(testimonialSchema), asyncHandler(createTestimonial));
router.put("/:id", validate(idParamsSchema.merge(testimonialSchema)), asyncHandler(updateTestimonial));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteTestimonial));

export default router;
