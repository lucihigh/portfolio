import { Router } from "express";
import {
  createCourseUnit,
  deleteCourseUnit,
  listCourseUnits,
  updateCourseUnit
} from "../controllers/course-unit.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { courseUnitSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listCourseUnits));
router.post("/", validate(courseUnitSchema), asyncHandler(createCourseUnit));
router.put("/:id", validate(idParamsSchema.merge(courseUnitSchema)), asyncHandler(updateCourseUnit));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteCourseUnit));

export default router;
