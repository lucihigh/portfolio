import { Router } from "express";
import { getSettings, upsertSettings } from "../controllers/setting.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { siteSettingSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(getSettings));
router.put("/", validate(siteSettingSchema), asyncHandler(upsertSettings));

export default router;
