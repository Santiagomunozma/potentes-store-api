import { z } from "zod";

export const createCouponSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3),
  status: z.enum(["active", "inactive"]),
  discount: z.number().positive(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  maxUses: z.number().int().positive().nullable().optional(),
});

export const updateCouponSchema = createCouponSchema.deepPartial();
