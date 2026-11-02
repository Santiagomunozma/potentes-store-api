import { Router, Request, Response } from "express";
import { SellController } from "../controllers";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.post("/", authenticateJWT, async (req: Request, res: Response) =>
  SellController.createSell(req, res)
);

router.put("/:id", ...employee, async (req: Request, res: Response) =>
  SellController.updateSell(req, res)
);

router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  SellController.deleteSell(req, res)
);

router.get("/", ...employee, async (req: Request, res: Response) =>
  SellController.getAllSells(req, res)
);

router.get("/my-sells", authenticateJWT, async (req, res) =>
  SellController.getSellsByAuthenticatedUser(req, res)
);

router.get("/stats", ...employee, async (req: Request, res: Response) =>
  SellController.getStats(req, res)
);

router.patch("/:id/status", ...employee, async (req: Request, res: Response) =>
  SellController.updateStatus(req, res)
);

router.post("/:id/cancel", ...employee, async (req: Request, res: Response) =>
  SellController.cancelSell(req, res)
);

router.get("/:id", ...employee, async (req: Request, res: Response) =>
  SellController.getSellById(req, res)
);

export { router as sellRoutes };
