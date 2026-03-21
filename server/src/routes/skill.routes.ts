import { Router } from "express";
import { createSkill, deleteSkill, listSkills, updateSkill } from "../controllers/skill.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { skillSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listSkills));
router.post("/", validate(skillSchema), asyncHandler(createSkill));
router.put("/:id", validate(idParamsSchema.merge(skillSchema)), asyncHandler(updateSkill));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteSkill));

export default router;
