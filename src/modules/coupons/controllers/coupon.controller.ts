import { Request, Response } from "express";
import { paramString } from "../../../utils/routeParams";
import { createCouponSchema, updateCouponSchema } from "../validations";
import { Coupon, CouponModel } from "../models";
import { CouponPresenter } from "../presenters";

export const CouponController = {
  createCoupon: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Creating coupon...", req.body);
      const result = createCouponSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json(CouponPresenter.formatError(result.error));
        return;
      }

      const coupon = await CouponModel.create(result.data as Coupon);
      res
        .status(201)
        .json(
          CouponPresenter.formatSuccess(
            CouponPresenter.formatCoupon(coupon),
            "Coupon created successfully"
          )
        );
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },

  updateCoupon: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);
      const result = updateCouponSchema.safeParse({ ...req.body, id });

      if (!result.success) {
        res.status(400).json(CouponPresenter.formatError(result.error));
        return;
      }

      const coupon = await CouponModel.update(result.data as Coupon);
      res
        .status(200)
        .json(
          CouponPresenter.formatSuccess(
            CouponPresenter.formatCoupon(coupon),
            "Coupon updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },

  deleteCoupon: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);

      if (!id) {
        res
          .status(400)
          .json(
            CouponPresenter.formatError({ message: "Coupon ID is required" })
          );
        return;
      }

      const coupon = await CouponModel.delete(id);
      res
        .status(200)
        .json(
          CouponPresenter.formatSuccess(
            CouponPresenter.formatCoupon(coupon),
            "Coupon deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },

  getCouponById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);

      if (!id) {
        res
          .status(400)
          .json(
            CouponPresenter.formatError({ message: "Coupon ID is required" })
          );
        return;
      }

      const coupon = await CouponModel.findById(id);
      res
        .status(200)
        .json(
          CouponPresenter.formatSuccess(
            CouponPresenter.formatCoupon(coupon),
            "Coupon retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },

  getAllCoupons: async (req: Request, res: Response): Promise<void> => {
    try {
      const coupons = await CouponModel.findAll();
      res
        .status(200)
        .json(
          CouponPresenter.formatSuccess(
            CouponPresenter.formatCouponList(coupons),
            "Coupons retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },

  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await CouponModel.getMonthlyStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },

  getCouponByCode: async (req: Request, res: Response): Promise<void> => {
    try {
      const code = paramString(req.params.code);
      if (!code) {
        res
          .status(400)
          .json(
            CouponPresenter.formatError({ message: "Coupon code is required" })
          );
        return;
      }
      const coupon = await CouponModel.findByCode(code);
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json(CouponPresenter.formatError(error));
    }
  },
};
