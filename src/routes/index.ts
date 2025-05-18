import { Router } from "express";
import { userRoutes } from "../modules/users";
import { productRoutes } from "../modules/products";
import { sellRoutes } from "../modules/sell";
import { couponRoutes } from "../modules/coupons";
import { inventoryRoutes } from "../modules/inventory";
import { colorRoutes } from "../modules/color";
import { sizeRoutes } from "../modules/size";
import { authRoutes } from "../modules/auth";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/sells", sellRoutes);
router.use("/coupons", couponRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/colors", colorRoutes);
router.use("/sizes", sizeRoutes);
export default router;
