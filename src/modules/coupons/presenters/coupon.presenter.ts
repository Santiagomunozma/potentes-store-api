import { Coupon } from "../models";

export const CouponPresenter = {
  formatCoupon: (coupon: any): Partial<Coupon> | null => {
    if (!coupon) return null;
    return coupon;
  },

  formatCouponList: (coupons: any[]): Partial<Coupon>[] => {
    if (!coupons || !coupons.length) return [];
    return coupons;
  },

  formatError: (error: any) => {
    return {
      error: error.message || "An error occurred",
      status: "error",
    };
  },

  formatSuccess: (data: any, message: string = "Operation successful") => {
    return {
      data,
      message,
      status: "success",
    };
  },
};
