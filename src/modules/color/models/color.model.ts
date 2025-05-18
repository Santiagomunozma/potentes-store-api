import { prisma } from "../../../config/prisma";

export type Color = {
  id: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export const ColorModel = {
  findAll: async () => {
    const colors = await prisma.color.findMany();
    return colors;
  },

  create: async (data: Color) => {
    const newColor = await prisma.color.create({
      data,
    });
    return newColor;
  },

  update: async (data: Color) => {
    const updatedColor = await prisma.color.update({
      where: { id: data.id },
      data,
    });
    return updatedColor;
  },

  delete: async (id: string) => {
    const deletedColor = await prisma.color.delete({
      where: { id },
    });
    return deletedColor;
  },

  findById: async (id: string) => {
    const color = await prisma.color.findUnique({
      where: { id },
    });
    return color;
  },
};
