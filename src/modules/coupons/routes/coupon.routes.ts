import { Router, Request, Response } from "express";
import { CouponController } from "../controllers";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.post("/", ...employee, async (req: Request, res: Response) =>
  CouponController.createCoupon(req, res)
);

router.put("/:id", ...employee, async (req: Request, res: Response) =>
  CouponController.updateCoupon(req, res)
);

router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  CouponController.deleteCoupon(req, res)
);

router.get("/", ...employee, async (req: Request, res: Response) =>
  CouponController.getAllCoupons(req, res)
);

router.get("/stats", ...employee, async (req: Request, res: Response) =>
  CouponController.getStats(req, res)
);

router.get("/code/:code", async (req: Request, res: Response) =>
  CouponController.getCouponByCode(req, res)
);

router.get("/:id", ...employee, async (req: Request, res: Response) =>
  CouponController.getCouponById(req, res)
);

export { router as couponRoutes };
