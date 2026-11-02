import { Router, Request, Response } from "express";
import { CategoryController } from "../controllers/category.controller";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.get("/", async (req: Request, res: Response) =>
  CategoryController.getAllCategories(req, res)
);
router.post("/", ...employee, async (req: Request, res: Response) =>
  CategoryController.createCategory(req, res)
);
router.put("/:id", ...employee, async (req: Request, res: Response) =>
  CategoryController.updateCategory(req, res)
);
router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  CategoryController.deleteCategory(req, res)
);

export { router as categoryRoutes };
