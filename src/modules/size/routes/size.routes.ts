import { Request, Response, Router } from "express";
import { SizeController } from "../controllers";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await SizeController.createSize(req, res)
);

router.put(
  "/:id",
  async (req: Request, res: Response) =>
    await SizeController.updateSize(req, res)
);

router.delete(
  "/:id",
  async (req: Request, res: Response) =>
    await SizeController.deleteSize(req, res)
);

router.get(
  "/",
  async (req: Request, res: Response) =>
    await SizeController.getAllSizes(req, res)
);

router.get(
  "/:id",
  async (req: Request, res: Response) =>
    await SizeController.getSizeById(req, res)
);

export { router as sizeRoutes };
