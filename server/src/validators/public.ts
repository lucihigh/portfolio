import { z } from "zod";
import { optionalUrl } from "./common.js";

export const publicTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    company: z.string().optional(),
    content: z.string().min(10),
    avatarUrl: optionalUrl
  })
});
