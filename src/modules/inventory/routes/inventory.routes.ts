import { Router, Request, Response } from "express";
import { InventoryController } from "../controllers";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.post("/", ...employee, async (req: Request, res: Response) =>
  InventoryController.createInventory(req, res)
);

router.put("/:id", ...employee, async (req: Request, res: Response) =>
  InventoryController.updateInventory(req, res)
);

router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  InventoryController.deleteInventory(req, res)
);

router.get("/low-stock", ...employee, async (req: Request, res: Response) =>
  InventoryController.getLowStock(req, res)
);

router.get("/:id", ...employee, async (req: Request, res: Response) =>
  InventoryController.getInventoryById(req, res)
);

router.get("/", ...employee, async (req: Request, res: Response) =>
  InventoryController.getAllInventories(req, res)
);

export { router as inventoryRoutes };
