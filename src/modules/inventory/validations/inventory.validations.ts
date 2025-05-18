import { z } from "zod";

export const createInventorySchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  quantity: z.number().min(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateInventorySchema = createInventorySchema.deepPartial();
