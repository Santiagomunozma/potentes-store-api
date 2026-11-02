import { Router, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import {
  authenticateJWT,
  requireEmployee,
} from "../auth/middleware/auth.middleware";

const router = Router();

router.get(
  "/overview",
  authenticateJWT,
  requireEmployee,
  async (req: Request, res: Response) => AdminController.overview(req, res)
);

export { router as adminRoutes };
