import { prisma } from "../../../config/prisma";

export type Size = {
  id: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
};

export const SizeModel = {
  findAll: async () => {
    const sizes = await prisma.size.findMany();
    return sizes;
  },

  create: async (data: Size) => {
    const newSize = await prisma.size.create({
      data,
    });
    return newSize;
  },

  update: async (data: Size) => {
    const updatedSize = await prisma.size.update({
      where: { id: data.id },
      data,
    });
    return updatedSize;
  },

  delete: async (id: string) => {
    const deletedSize = await prisma.size.delete({
      where: { id },
    });
    return deletedSize;
  },

  findById: async (id: string) => {
    const size = await prisma.size.findUnique({
      where: { id },
    });
    return size;
  },
};
