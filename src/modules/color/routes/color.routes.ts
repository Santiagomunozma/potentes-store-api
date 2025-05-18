import { Request, Response, Router } from "express";
import { ColorController } from "../controllers/color.controller";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await ColorController.createColor(req, res)
);

router.put(
  "/:id",
  async (req: Request, res: Response) =>
    await ColorController.updateColor(req, res)
);

router.delete(
  "/:id",
  async (req: Request, res: Response) =>
    await ColorController.deleteColor(req, res)
);

router.get(
  "/",
  async (req: Request, res: Response) =>
    await ColorController.getAllColors(req, res)
);

router.get(
  "/:id",
  async (req: Request, res: Response) =>
    await ColorController.getColorById(req, res)
);

export { router as colorRoutes };
