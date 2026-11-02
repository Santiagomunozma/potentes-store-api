import { z } from "zod";

export const createCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
});
