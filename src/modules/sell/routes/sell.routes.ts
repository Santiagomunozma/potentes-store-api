import { Router, Request, Response } from "express";
import { SellController } from "../controllers";
import { authenticateJWT } from "../../auth/middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await SellController.createSell(req, res)
);

router.put(
  "/:id",
  async (req: Request, res: Response) =>
    await SellController.updateSell(req, res)
);

router.delete(
  "/:id",
  async (req: Request, res: Response) =>
    await SellController.deleteSell(req, res)
);

router.get(
  "/",
  async (req: Request, res: Response) =>
    await SellController.getAllSells(req, res)
);

router.get(
  "/my-sells",
  authenticateJWT,
  async (req, res) => await SellController.getSellsByAuthenticatedUser(req, res)
);

router.get(
  "/stats",
  async (req: Request, res: Response) => await SellController.getStats(req, res)
);

router.get(
  "/:id",
  async (req: Request, res: Response) =>
    await SellController.getSellById(req, res)
);

export { router as sellRoutes };
