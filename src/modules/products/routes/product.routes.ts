import { Router, Request, Response } from "express";
import { ProductController } from "../controllers";

const router = Router();

router.post(
  "/",
  async (req: Request, res: Response) =>
    await ProductController.createProduct(req, res)
);

router.put(
  "/:id",
  async (req: Request, res: Response) =>
    await ProductController.updateProduct(req, res)
);

router.delete(
  "/:id",
  async (req: Request, res: Response) =>
    await ProductController.deleteProduct(req, res)
);

router.get(
  "/",
  async (req: Request, res: Response) =>
    await ProductController.getAllProducts(req, res)
);

router.get("/stats", async (req: Request, res: Response) => {
  console.log("Getting stats");
  return await ProductController.getStats(req, res);
});

router.get(
  "/:id",
  async (req: Request, res: Response) =>
    await ProductController.getProductById(req, res)
);

export { router as productRoutes };
