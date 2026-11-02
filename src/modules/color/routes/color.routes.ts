import { Request, Response, Router } from "express";
import { ColorController } from "../controllers/color.controller";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.post("/", ...employee, async (req: Request, res: Response) =>
  ColorController.createColor(req, res)
);

router.put("/:id", ...employee, async (req: Request, res: Response) =>
  ColorController.updateColor(req, res)
);

router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  ColorController.deleteColor(req, res)
);

router.get("/", ...employee, async (req: Request, res: Response) =>
  ColorController.getAllColors(req, res)
);

router.get("/:id", ...employee, async (req: Request, res: Response) =>
  ColorController.getColorById(req, res)
);

export { router as colorRoutes };
