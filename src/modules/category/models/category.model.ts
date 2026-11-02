import { prisma } from "../../../config/prisma";

export type Category = {
  id?: string;
  name: string;
};

export const CategoryModel = {
  findAll: async () => prisma.category.findMany({ orderBy: { name: "asc" } }),

  create: async (data: Category) =>
    prisma.category.create({ data: { name: data.name } }),

  update: async (data: Category) =>
    prisma.category.update({
      where: { id: data.id },
      data: { name: data.name },
    }),

  delete: async (id: string) => prisma.category.delete({ where: { id } }),

  findById: async (id: string) =>
    prisma.category.findUnique({ where: { id } }),
};
