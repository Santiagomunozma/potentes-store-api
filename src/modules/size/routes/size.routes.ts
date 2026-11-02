import { Request, Response, Router } from "express";
import { SizeController } from "../controllers";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.post("/", ...employee, async (req: Request, res: Response) =>
  SizeController.createSize(req, res)
);

router.put("/:id", ...employee, async (req: Request, res: Response) =>
  SizeController.updateSize(req, res)
);

router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  SizeController.deleteSize(req, res)
);

router.get("/", ...employee, async (req: Request, res: Response) =>
  SizeController.getAllSizes(req, res)
);

router.get("/:id", ...employee, async (req: Request, res: Response) =>
  SizeController.getSizeById(req, res)
);

export { router as sizeRoutes };
