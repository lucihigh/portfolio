import { Router } from "express";
import {
  createAchievement,
  deleteAchievement,
  listAchievements,
  updateAchievement
} from "../controllers/achievement.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { achievementSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listAchievements));
router.post("/", validate(achievementSchema), asyncHandler(createAchievement));
router.put("/:id", validate(idParamsSchema.merge(achievementSchema)), asyncHandler(updateAchievement));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteAchievement));

export default router;
