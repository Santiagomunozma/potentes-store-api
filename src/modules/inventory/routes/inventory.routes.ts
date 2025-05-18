import { Router, Request, Response } from "express";
import { InventoryController } from "../controllers";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await InventoryController.createInventory(req, res)
);

router.put(
  "/:id",
  async (req: Request, res: Response) =>
    await InventoryController.updateInventory(req, res)
);

router.delete(
  "/:id",
  async (req: Request, res: Response) =>
    await InventoryController.deleteInventory(req, res)
);

router.get(
  "/:id",
  async (req: Request, res: Response) =>
    await InventoryController.getInventoryById(req, res)
);

router.get(
  "/",
  async (req: Request, res: Response) =>
    await InventoryController.getAllInventories(req, res)
);

export { router as inventoryRoutes };
