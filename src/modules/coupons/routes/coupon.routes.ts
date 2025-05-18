import { Router, Request, Response } from "express";
import { CouponController } from "../controllers";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await CouponController.createCoupon(req, res)
);

router.put(
  "/:id",
  async (req: Request, res: Response) =>
    await CouponController.updateCoupon(req, res)
);

router.delete(
  "/:id",
  async (req: Request, res: Response) =>
    await CouponController.deleteCoupon(req, res)
);

router.get(
  "/",
  async (req: Request, res: Response) =>
    await CouponController.getAllCoupons(req, res)
);

router.get(
  "/stats",
  async (req: Request, res: Response) =>
    await CouponController.getStats(req, res)
);

router.get(
  "/code/:code",
  async (req: Request, res: Response) =>
    await CouponController.getCouponByCode(req, res)
);

router.get(
  "/:id",
  async (req: Request, res: Response) =>
    await CouponController.getCouponById(req, res)
);

export { router as couponRoutes };
