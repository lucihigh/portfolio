import { Router } from "express";
import { createContact, deleteContact, listContacts, updateContact } from "../controllers/contact.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { idParamsSchema } from "../validators/common.js";
import { contactSchema } from "../validators/entities.js";

const router = Router();

router.get("/", asyncHandler(listContacts));
router.post("/", validate(contactSchema), asyncHandler(createContact));
router.put("/:id", validate(idParamsSchema.merge(contactSchema)), asyncHandler(updateContact));
router.delete("/:id", validate(idParamsSchema), asyncHandler(deleteContact));

export default router;
