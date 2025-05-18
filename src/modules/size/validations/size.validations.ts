import { z } from "zod";

export const createSizeSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateSizeSchema = createSizeSchema.deepPartial();
