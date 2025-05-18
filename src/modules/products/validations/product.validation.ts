import { z } from "zod";

export const createProductSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  status: z.enum(["active", "inactive"]),
  name: z.string(),
  careInstructions: z.string(),
  imageUrl: z.string().url(),
  description: z.string(),
  price: z.number().positive(),
  inventory: z.array(
    z.object({
      sizeId: z.string(),
      colorId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const updateProductSchema = createProductSchema.deepPartial();
