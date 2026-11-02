import { Router, Request, Response } from "express";
import { UserController } from "../controllers";
import {
  authenticateJWT,
  authenticateJWTOptional,
  AuthenticatedRequest,
  requireAdmin,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticateJWTOptional,
  async (req: Request, res: Response) =>
    await UserController.createUser(req, res)
);

router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.updateUser(req, res)
);

router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.deleteUser(req, res)
);

router.get("/stats", authenticateJWT, requireEmployee, async (req: Request, res: Response) => {
  await UserController.getStats(req, res);
});

router.get(
  "/",
  authenticateJWT,
  requireEmployee,
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.getAllUsers(req, res)
);

router.get(
  "/:id",
  authenticateJWT,
  requireEmployee,
  async (req: AuthenticatedRequest, res: Response) =>
    await UserController.getUserById(req, res)
);

export { router as userRoutes };
