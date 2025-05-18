import { z } from "zod";

export const createSellSchema = z.object({
  customerId: z.string(),
  employeeId: z.string().optional(),
  totalPrice: z.number().positive(),
  couponCode: z.string().optional(),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      totalPrice: z.number().positive(),
      colorId: z.string(),
      sizeId: z.string(),
    })
  ),
});

export const updateSellSchema = createSellSchema.deepPartial();
