import { prisma } from "../../../config/prisma";

export type Inventory = {
  id?: string;
  productId: string;
  sizeId: string;
  colorId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export const InventoryModel = {
  findAll: async () => {
    const inventories = await prisma.inventory.findMany();
    return inventories;
  },

  create: async (data: Inventory) => {
    const newInventory = await prisma.inventory.create({
      data,
    });
    return newInventory;
  },

  update: async (data: Inventory) => {
    const updatedInventory = await prisma.inventory.update({
      where: {
        id: data.id,
      },
      data,
    });
    return updatedInventory;
  },

  delete: async (id: string) => {
    const deletedInventory = await prisma.inventory.delete({
      where: {
        id,
      },
    });
    return deletedInventory;
  },

  findById: async (id: string) => {
    const inventory = await prisma.inventory.findUnique({
      where: {
        id,
      },
    });
    return inventory;
  },
};
