import { z } from "zod";

export const idParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const stringArray = z.array(z.string().min(1)).default([]);

export const optionalUrl = z
  .string()
  .url()
  .or(z.literal(""))
  .transform((value) => value || undefined)
  .optional();

export const optionalDate = z
  .string()
  .datetime()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined))
  .optional();
