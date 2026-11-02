import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const LOW_STOCK = 5;

export const AdminController = {
  overview: async (_req: Request, res: Response): Promise<void> => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const from = new Date(now);
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);

    const activeFilter = { status: { not: "cancelled" } };

    const [monthSales, monthRevenue, activeProducts, lowStock, recentSells, topLines] =
      await Promise.all([
        prisma.sell.count({
          where: { createdAt: { gte: monthStart }, ...activeFilter },
        }),
        prisma.sell.aggregate({
          where: { createdAt: { gte: monthStart }, ...activeFilter },
          _sum: { totalPrice: true },
        }),
        prisma.product.count({ where: { status: "active" } }),
        prisma.inventory.count({ where: { quantity: { lte: LOW_STOCK } } }),
        prisma.sell.findMany({
          where: { createdAt: { gte: from }, ...activeFilter },
          select: { createdAt: true, totalPrice: true },
        }),
        prisma.productSell.groupBy({
          by: ["productId"],
          where: { sell: activeFilter },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
      ]);

    const dailyMap = new Map<string, number>();
    for (let i = 0; i < 30; i += 1) {
      const day = new Date(from);
      day.setDate(from.getDate() + i);
      dailyMap.set(day.toISOString().slice(0, 10), 0);
    }
    for (const sell of recentSells) {
      const key = sell.createdAt.toISOString().slice(0, 10);
      if (dailyMap.has(key)) {
        dailyMap.set(key, (dailyMap.get(key) || 0) + sell.totalPrice);
      }
    }

    const products = await prisma.product.findMany({
      where: { id: { in: topLines.map((line) => line.productId) } },
      select: { id: true, name: true },
    });
    const names = new Map(products.map((product) => [product.id, product.name]));

    res.status(200).json({
      data: {
        monthSales,
        monthRevenue: monthRevenue._sum.totalPrice || 0,
        activeProducts,
        lowStock,
        dailyRevenue: Array.from(dailyMap.entries()).map(([date, ingresos]) => ({
          date,
          ingresos: Math.round(ingresos),
        })),
        topProducts: topLines.map((line) => ({
          name: names.get(line.productId) || "Producto",
          quantity: line._sum.quantity || 0,
        })),
      },
      status: "success",
    });
  },
};
