import { Router, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import {
  authenticateJWT,
  AuthenticatedRequest,
} from "./middleware/auth.middleware";

const router = Router();

router.post(
  "/login",
  async (req: Request, res: Response) => await AuthController.login(req, res)
);

router.get(
  "/profile",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response) =>
    await AuthController.getProfile(req, res)
);

export { router as authRoutes };
