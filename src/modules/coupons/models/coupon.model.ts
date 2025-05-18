import { prisma } from "../../../config/prisma";

// Type definitions
export type Coupon = {
  id?: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Database operations (Model functionality)
export const CouponModel = {
  findAll: async () => {
    const coupons = await prisma.coupon.findMany();
    return coupons;
  },

  create: async (data: Coupon) => {
    const newCoupon = await prisma.coupon.create({
      data,
    });
    return newCoupon;
  },

  update: async (data: Coupon) => {
    const updatedCoupon = await prisma.coupon.update({
      where: {
        id: data.id,
      },
      data,
    });
    return updatedCoupon;
  },

  delete: async (id: string) => {
    const deletedCoupon = await prisma.coupon.delete({
      where: {
        id,
      },
    });
    return deletedCoupon;
  },

  findById: async (id: string) => {
    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });
    return coupon;
  },

  getMonthlyStats: async () => {
    try {
      console.log("Getting monthly coupon stats");

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const [
        totalCoupons,
        activeCoupons,
        newCoupons,
        totalDiscount,
        lastMonthTotal,
        lastMonthActive,
        lastMonthNew,
        lastMonthDiscount,
      ] = await Promise.all([
        // Current month stats
        prisma.coupon.count(),
        prisma.coupon.count({
          where: {
            status: "active",
            endDate: { gte: now },
          },
        }),
        prisma.coupon.count({
          where: {
            createdAt: { gte: firstDayOfMonth },
          },
        }),
        prisma.sell.aggregate({
          where: {
            couponCode: { not: null },
            createdAt: { gte: firstDayOfMonth },
          },
          _sum: {
            totalPrice: true,
          },
        }),
        // Last month stats
        prisma.coupon.count({
          where: {
            createdAt: { lt: firstDayOfMonth },
          },
        }),
        prisma.coupon.count({
          where: {
            status: "active",
            endDate: { gte: firstDayOfMonth },
            createdAt: { lt: firstDayOfMonth },
          },
        }),
        prisma.coupon.count({
          where: {
            createdAt: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfMonth,
            },
          },
        }),
        prisma.sell.aggregate({
          where: {
            couponCode: { not: null },
            createdAt: {
              gte: firstDayOfLastMonth,
              lt: firstDayOfMonth,
            },
          },
          _sum: {
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
          label: "Total cupones",
          value: totalCoupons.toString(),
          change: calculateChange(totalCoupons, lastMonthTotal),
        },
        {
          label: "Cupones activos",
          value: activeCoupons.toString(),
          change: calculateChange(activeCoupons, lastMonthActive),
        },
        {
          label: "Cupones nuevos",
          value: newCoupons.toString(),
          change: calculateChange(newCoupons, lastMonthNew),
        },
        {
          label: "Descuentos aplicados",
          value: `$${(totalDiscount._sum.totalPrice || 0).toFixed(2)}`,
          change: calculateChange(
            totalDiscount._sum.totalPrice || 0,
            lastMonthDiscount._sum.totalPrice || 0
          ),
        },
      ];
    } catch (error) {
      console.error("Error getting monthly coupon stats:", error);
      return [
        {
          label: "Total cupones",
          value: "0",
          change: "0%",
        },
        {
          label: "Cupones activos",
          value: "0",
          change: "0%",
        },
        {
          label: "Cupones nuevos",
          value: "0",
          change: "0%",
        },
        {
          label: "Descuentos aplicados",
          value: "$0.00",
          change: "0%",
        },
      ];
    }
  },

  findByCode: async (code: string) => {
    const coupon = await prisma.coupon.findUnique({
      where: {
        code,
      },
    });
    return coupon;
  },
};
