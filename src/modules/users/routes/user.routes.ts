import { Router, Request, Response } from "express";
import { UserController } from "../controllers";
import {
  authenticateJWT,
  AuthenticatedRequest,
} from "../../auth/middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await UserController.createUser(req, res)
);

router.put(
  "/:id",
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.updateUser(req, res)
);

router.delete(
  "/:id",
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.deleteUser(req, res)
);

router.get(
  "/",
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.getAllUsers(req, res)
);

router.get(
  "/:id",
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.getUserById(req, res)
);

export { router as userRoutes };
