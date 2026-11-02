import { Router, Request, Response } from "express";
import { ProductController } from "../controllers";
import {
  authenticateJWT,
  requireEmployee,
} from "../../auth/middleware/auth.middleware";

const router = Router();
const employee = [authenticateJWT, requireEmployee];

router.post("/", ...employee, async (req: Request, res: Response) =>
  ProductController.createProduct(req, res)
);

router.put("/:id", ...employee, async (req: Request, res: Response) =>
  ProductController.updateProduct(req, res)
);

router.delete("/:id", ...employee, async (req: Request, res: Response) =>
  ProductController.deleteProduct(req, res)
);

router.get("/", async (req: Request, res: Response) =>
  ProductController.getAllProducts(req, res)
);

router.get("/stats", ...employee, async (req: Request, res: Response) => {
  return ProductController.getStats(req, res);
});

router.get("/:id", async (req: Request, res: Response) =>
  ProductController.getProductById(req, res)
);

export { router as productRoutes };
