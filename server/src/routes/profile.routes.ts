import { Router } from "express";
import { getProfile, upsertProfile } from "../controllers/profile.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { upsertProfileSchema } from "../validators/profile.js";

const router = Router();

router.get("/", asyncHandler(getProfile));
router.put("/", validate(upsertProfileSchema), asyncHandler(upsertProfile));

export default router;
