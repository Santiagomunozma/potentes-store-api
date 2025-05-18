import { z } from "zod";

export const createColorSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(3),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateColorSchema = createColorSchema.deepPartial();
