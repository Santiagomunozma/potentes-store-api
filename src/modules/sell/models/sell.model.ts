import { prisma } from "../../../config/prisma";

// Type definitions
export type ProductSell = {
  id?: string;
  productId: string;
  quantity: number;
  colorId: string;
  sizeId: string;
  totalPrice: number;
  sellId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Sell = {
  id?: string;
  customerId: string;
  employeeId?: string;
  totalPrice: number; // Total price for the entire sell
  couponCode?: string;
  createdAt?: Date;
  updatedAt?: Date;

  products: ProductSell[];
};

// Database operations (Model functionality)
export const SellModel = {
  findAll: async () => {
    const sells = await prisma.sell.findMany({
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        employee: true,
        productSells: {
          include: {
            product: true,
            color: true,
            size: true,
          },
        },
      },
    });

    return sells;
  },

  create: async (data: Sell) => {
    try {
      console.log("Create Sell - Input data:", JSON.stringify(data, null, 2));

      // Validate input data
      if (!data) {
        throw new Error("Sell data is undefined");
      }

      if (!data.customerId) {
        throw new Error("Customer ID is required");
      }

      if (typeof data.totalPrice !== "number" || data.totalPrice <= 0) {
        throw new Error("Valid total price is required");
      }

      // Ensure products is an array even if undefined
      const products = data.products || [];
      console.log("Products array:", JSON.stringify(products, null, 2));

      // Remove products from sell data
      const { products: _, ...sell } = data;

      const newSell = await prisma.sell.create({
        data: sell,
      });
      console.log("Created sell:", JSON.stringify(newSell, null, 2));

      // If no products, just return the created sell
      if (!products || products.length === 0) {
        console.log("No products to add");
        return prisma.sell.findUnique({
          where: {
            id: newSell.id,
          },
          include: {
            customer: true,
            employee: true,
            productSells: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        });
      }

      // Ensure we have a default color and size for required relationships
      // First, fetch the first available color and size from the database
      const defaultColor = await prisma.color.findFirst();
      const defaultSize = await prisma.size.findFirst();

      if (!defaultColor || !defaultSize) {
        throw new Error(
          "Cannot create product sells: No default color or size available in the database"
        );
      }

      console.log("Processing", products.length, "products");
      const productSellPromises = products
        .map((product) => {
          if (!product) {
            console.error("Product item is undefined");
            return null;
          }

          if (!product.productId) {
            console.error("Product ID is missing");
            return null;
          }

          return prisma.productSell.create({
            data: {
              quantity: product.quantity || 1,
              totalPrice: product.totalPrice || 0,
              product: {
                connect: { id: product.productId },
              },
              sell: {
                connect: { id: newSell.id },
              },
              // Use provided IDs if they exist, otherwise fall back to defaults
              color: {
                connect: { id: product.colorId || defaultColor.id },
              },
              size: {
                connect: { id: product.sizeId || defaultSize.id },
              },
            },
          });
        })
        .filter(Boolean); // Filter out any null entries

      if (productSellPromises.length === 0) {
        console.log("No valid products to create");
        return prisma.sell.findUnique({
          where: {
            id: newSell.id,
          },
          include: {
            customer: true,
            employee: true,
            productSells: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        });
      }

      const createdProductSells = await Promise.all(productSellPromises);
      console.log(
        "Created product sells:",
        JSON.stringify(createdProductSells, null, 2)
      );

      const createdSell = await prisma.sell.findUnique({
        where: {
          id: newSell.id,
        },
        include: {
          customer: true,
          employee: true,
          productSells: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      });

      return createdSell;
    } catch (error) {
      console.error("Error in SellModel.create:", error);
      throw error;
    }
  },

  update: async (data: Sell) => {
    try {
      console.log("Update Sell - Input data:", JSON.stringify(data, null, 2));

      // Validate input data
      if (!data) {
        throw new Error("Sell data is undefined");
      }

      if (!data.id) {
        throw new Error("Sell ID is required for update");
      }

      // Ensure products is an array even if undefined
      const products = data.products || [];
      console.log("Products array:", JSON.stringify(products, null, 2));

      // Remove products from sell data
      const { products: _, ...sell } = data;

      const updatedSell = await prisma.sell.update({
        where: {
          id: data.id,
        },
        data: sell,
      });
      console.log("Updated sell:", JSON.stringify(updatedSell, null, 2));

      await prisma.productSell.deleteMany({
        where: {
          sellId: data.id,
        },
      });
      console.log("Deleted existing product sells");

      // If no products, just return the updated sell
      if (!products || products.length === 0) {
        console.log("No new products to add");
        return prisma.sell.findUnique({
          where: {
            id: updatedSell.id,
          },
          include: {
            customer: true,
            employee: true,
            productSells: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        });
      }

      // Ensure we have a default color and size for required relationships
      // First, fetch the first available color and size from the database
      const defaultColor = await prisma.color.findFirst();
      const defaultSize = await prisma.size.findFirst();

      if (!defaultColor || !defaultSize) {
        throw new Error(
          "Cannot create product sells: No default color or size available in the database"
        );
      }

      console.log("Processing", products.length, "products");
      const productSellPromises = products
        .map((product) => {
          if (!product) {
            console.error("Product item is undefined");
            return null;
          }

          if (!product.productId) {
            console.error("Product ID is missing");
            return null;
          }

          return prisma.productSell.create({
            data: {
              quantity: product.quantity || 1,
              totalPrice: product.totalPrice || 0,
              product: {
                connect: { id: product.productId },
              },
              sell: {
                connect: { id: updatedSell.id },
              },
              // Use provided IDs if they exist, otherwise fall back to defaults
              color: {
                connect: { id: product.colorId || defaultColor.id },
              },
              size: {
                connect: { id: product.sizeId || defaultSize.id },
              },
            },
          });
        })
        .filter(Boolean); // Filter out any null entries

      if (productSellPromises.length === 0) {
        console.log("No valid products to create");
        return prisma.sell.findUnique({
          where: {
            id: updatedSell.id,
          },
          include: {
            customer: true,
            employee: true,
            productSells: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        });
      }

      const createdProductSells = await Promise.all(productSellPromises);
      console.log(
        "Created product sells:",
        JSON.stringify(createdProductSells, null, 2)
      );

      const refreshedSell = await prisma.sell.findUnique({
        where: {
          id: updatedSell.id,
        },
        include: {
          customer: true,
          employee: true,
          productSells: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      });

      return refreshedSell;
    } catch (error) {
      console.error("Error in SellModel.update:", error);
      throw error;
    }
  },

  delete: async (id: string) => {
    await prisma.productSell.deleteMany({
      where: {
        sellId: id,
      },
    });

    const deletedSell = await prisma.sell.delete({
      where: {
        id,
      },
    });

    return deletedSell;
  },

  findById: async (id: string) => {
    const sell = await prisma.sell.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        employee: true,
        productSells: {
          include: {
            product: true,
            color: true,
            size: true,
          },
        },
      },
    });

    return sell;
  },

  findByCustomerId: async (customerId: string) => {
    const sells = await prisma.sell.findMany({
      where: {
        customerId,
      },
      include: {
        customer: true,
        employee: true,
        productSells: {
          include: {
            product: true,
            color: true,
            size: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sells;
  },

  getMonthlyStats: async () => {
    try {
      console.log("Getting monthly sales stats");

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const [
        totalSales,
        totalRevenue,
        totalProductsSold,
        averageTicket,
        lastMonthSales,
        lastMonthRevenue,
        lastMonthProductsSold,
        lastMonthAverageTicket,
      ] = await Promise.all([
        // Current month stats
        prisma.sell.count({
          where: {
            createdAt: { gte: firstDayOfMonth },
          },
        }),
        prisma.sell.aggregate({
          where: {
            createdAt: { gte: firstDayOfMonth },
          },
          _sum: {
            totalPrice: true,
          },
        }),
        prisma.productSell.aggregate({
          where: {
            sell: {
              createdAt: { gte: firstDayOfMonth },
            },
          },
          _sum: {
            quantity: true,
          },
        }),
        prisma.sell.aggregate({
          where: {
            createdAt: { gte: firstDayOfMonth },
          },
          _avg: {
            totalPrice: true,
          },
        }),
        // Last month stats
        prisma.sell.count({
          where: {
            createdAt: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfMonth,
            },
          },
        }),
        prisma.sell.aggregate({
          where: {
            createdAt: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfMonth,
            },
          },
          _sum: {
            totalPrice: true,
          },
        }),
        prisma.productSell.aggregate({
          where: {
            sell: {
              createdAt: {
                gte: firstDayOfLastMonth,
                lt: firstDayOfMonth,
              },
            },
          },
          _sum: {
            quantity: true,
          },
        }),
        prisma.sell.aggregate({
          where: {
            createdAt: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfMonth,
            },
          },
          _avg: {
            totalPrice: true,
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
          label: "Total ventas",
          value: totalSales.toString(),
          change: calculateChange(totalSales, lastMonthSales),
        },
        {
          label: "Ingresos totales",
          value: `$${(totalRevenue._sum.totalPrice || 0).toFixed(2)}`,
          change: calculateChange(
            totalRevenue._sum.totalPrice || 0,
            lastMonthRevenue._sum.totalPrice || 0
          ),
        },
        {
          label: "Productos vendidos",
          value: (totalProductsSold._sum.quantity || 0).toString(),
          change: calculateChange(
            totalProductsSold._sum.quantity || 0,
            lastMonthProductsSold._sum.quantity || 0
          ),
        },
        {
          label: "Ticket promedio",
          value: `$${(averageTicket._avg.totalPrice || 0).toFixed(2)}`,
          change: calculateChange(
            averageTicket._avg.totalPrice || 0,
            lastMonthAverageTicket._avg.totalPrice || 0
          ),
        },
      ];
    } catch (error) {
      console.error("Error getting monthly sales stats:", error);
      return [
        {
          label: "Total ventas",
          value: "0",
          change: "0%",
        },
        {
          label: "Ingresos totales",
          value: "$0.00",
          change: "0%",
        },
        {
          label: "Productos vendidos",
          value: "0",
          change: "0%",
        },
        {
          label: "Ticket promedio",
          value: "$0.00",
          change: "0%",
        },
      ];
    }
  },
};
