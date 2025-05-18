import { prisma } from "../../../config/prisma";
import { Inventory } from "../../inventory";

// Type definitions
export type Product = {
  id?: string;
  sku: string;
  status: string;
  name: string;
  careInstructions: string;
  imageUrl: string;
  description: string;
  price: number;
  inventory?: Inventory[];
  createdAt?: Date;
  updatedAt?: Date;
};

// Database operations (Model functionality)
export const ProductModel = {
  findAll: async () => {
    const products = await prisma.product.findMany({
      include: {
        inventories: {
          include: {
            size: true,
            color: true,
          },
        },
      },
    });
    return products;
  },

  create: async (data: Product) => {
    const { inventory = [], ...productData } = data;

    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        inventories: {
          createMany: {
            data: inventory.map((inventory) => ({
              sizeId: inventory.sizeId,
              colorId: inventory.colorId,
              quantity: inventory.quantity,
            })),
          },
        },
      },
    });
    return newProduct;
  },

  update: async (data: Product) => {
    const { inventory = [], ...productData } = data;

    const updatedProduct = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: productData,
    });

    if (inventory.length > 0) {
      await prisma.inventory.deleteMany({
        where: {
          productId: data.id,
        },
      });

      await prisma.inventory.createMany({
        data: inventory.map((inventory) => ({
          ...inventory,
          productId: data.id!,
        })),
      });
    }

    return updatedProduct;
  },

  // New method that only updates product details without touching inventory
  updateProductOnly: async (data: Omit<Product, "inventory">) => {
    if (!data.id) {
      throw new Error("Product ID is required for update");
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        sku: data.sku,
        status: data.status,
        name: data.name,
        careInstructions: data.careInstructions,
        imageUrl: data.imageUrl,
        description: data.description,
        price: data.price,
      },
    });

    return updatedProduct;
  },

  delete: async (id: string) => {
    await prisma.inventory.deleteMany({
      where: {
        productId: id,
      },
    });

    const deletedProduct = await prisma.product.delete({
      where: {
        id,
      },
    });
    return deletedProduct;
  },

  findById: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        inventories: {
          include: {
            size: true,
            color: true,
          },
        },
      },
    });
    return product;
  },

  getMonthlyStats: async () => {
    try {
      console.log("Getting monthly stats");

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const [
        totalProducts,
        activeProducts,
        newProducts,
        productsWithNoStock,
        lastMonthTotal,
        lastMonthActive,
        lastMonthNew,
        lastMonthNoStock,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: "active" } }),
        prisma.product.count({
          where: { createdAt: { gte: firstDayOfMonth } },
        }),
        prisma.product.count({
          where: {
            inventories: {
              none: {
                quantity: { gt: 0 },
              },
            },
          },
        }),
        prisma.product.count({ where: { createdAt: { lt: firstDayOfMonth } } }),
        prisma.product.count({
          where: {
            status: "active",
            createdAt: { lt: firstDayOfMonth },
          },
        }),
        prisma.product.count({
          where: {
            createdAt: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfMonth,
            },
          },
        }),
        prisma.product.count({
          where: {
            createdAt: { lt: firstDayOfMonth },
            inventories: {
              none: {
                quantity: { gt: 0 },
              },
            },
          },
        }),
      ]);

      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
      };

      return [
        {
          label: "Total productos",
          value: totalProducts.toString(),
          change: calculateChange(totalProducts, lastMonthTotal),
        },
        {
          label: "Productos activos",
          value: activeProducts.toString(),
          change: calculateChange(activeProducts, lastMonthActive),
        },
        {
          label: "Productos nuevos",
          value: newProducts.toString(),
          change: calculateChange(newProducts, lastMonthNew),
        },
        {
          label: "Sin stock",
          value: productsWithNoStock.toString(),
          change: calculateChange(productsWithNoStock, lastMonthNoStock),
        },
      ];
    } catch (error) {
      console.error("Error getting monthly stats:", error);
      return [
        {
          label: "Total productos",
          value: "0",
          change: "0%",
        },
        {
          label: "Productos activos",
          value: "0",
          change: "0%",
        },
        {
          label: "Productos nuevos",
          value: "0",
          change: "0%",
        },
        {
          label: "Sin stock",
          value: "0",
          change: "0%",
        },
      ];
    }
  },
};
