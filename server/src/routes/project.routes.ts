import { Router } from "express";
import { createProject, deleteProject, listProjects, updateProject } from "../controllers/project.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { projectSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listProjects));
router.post("/", validate(projectSchema), asyncHandler(createProject));
router.put("/:id", validate(idParamsSchema.merge(projectSchema)), asyncHandler(updateProject));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteProject));

export default router;
