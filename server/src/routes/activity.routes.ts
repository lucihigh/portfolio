import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  listActivities,
  updateActivity
} from "../controllers/activity.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { activitySchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listActivities));
router.post("/", validate(activitySchema), asyncHandler(createActivity));
router.put("/:id", validate(idParamsSchema.merge(activitySchema)), asyncHandler(updateActivity));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteActivity));

export default router;
