import { z } from "zod";

export const createUserSchema = z.object({
  id: z.string().optional(),
  userType: z.enum(["Customer", "Employee"]),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8),
  identificationType: z.enum(["CC", "Passport", "TI"]),
  identificationNumber: z.string().min(10).max(15),
  employee: z
    .object({
      salary: z.number().positive(),
      employeeType: z.enum(["Admin", "Employee"]),
    })
    .optional(),
  customer: z
    .object({
      address: z.string(),
    })
    .optional(),
});

export const updateUserSchema = createUserSchema.deepPartial();
