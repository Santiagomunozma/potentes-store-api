import { Request, Response } from "express";
import { paramString } from "../../../utils/routeParams";
import { createSellSchema, updateSellSchema } from "../validations";
import { Sell, SellModel, ProductSell } from "../models";
import { SellPresenter } from "../presenters";
import { Product, ProductModel } from "../../products/models";
import { AuthenticatedRequest } from "../../auth/middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SellController = {
  createSell: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body) {
        res
          .status(400)
          .json(
            SellPresenter.formatError({ message: "Request body is missing" })
          );
        return;
      }

      if (!req.body.products) {
        res
          .status(400)
          .json(
            SellPresenter.formatError({ message: "Products array is missing" })
          );
        return;
      }

      const result = createSellSchema.safeParse(req.body);

      if (!result.success) {
        console.log("Validation errors:", result.error);
        res.status(400).json(SellPresenter.formatError(result.error));
        return;
      }

      if (!result.data.products || result.data.products.length === 0) {
        res.status(400).json(
          SellPresenter.formatError({
            message: "At least one product is required",
          })
        );
        return;
      }

      const authUser = (req as AuthenticatedRequest).user;
      if (
        !authUser?.customer?.id ||
        authUser.customer.id !== result.data.customerId
      ) {
        res.status(403).json(
          SellPresenter.formatError({
            message: "Solo un cliente autenticado puede registrar su compra",
          })
        );
        return;
      }

      if (result.data.couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: result.data.couponCode },
        });
        const now = new Date();
        const withinUses =
          coupon?.maxUses == null || coupon.usedCount < coupon.maxUses;
        const valid =
          coupon &&
          coupon.status === "active" &&
          now >= coupon.startDate &&
          now <= coupon.endDate &&
          withinUses;
        if (!valid) {
          res.status(400).json(
            SellPresenter.formatError({
              message: "El cupón no está vigente",
            })
          );
          return;
        }
      }

      for (const line of result.data.products) {
        const inventory = await prisma.inventory.findFirst({
          where: {
            productId: line.productId,
            colorId: line.colorId,
            sizeId: line.sizeId,
          },
        });

        const product = await prisma.product.findUnique({
          where: { id: line.productId },
        });
        if (!product || product.status !== "active") {
          res.status(400).json(
            SellPresenter.formatError({
              message: "Hay un producto inactivo en la compra",
            })
          );
          return;
        }

        if (!inventory || inventory.quantity < line.quantity) {
          res.status(400).json(
            SellPresenter.formatError({
              message: "No hay stock suficiente para completar la compra",
            })
          );
          return;
        }
      }

      const sell = await SellModel.create(result.data as Sell);

      if (result.data.couponCode) {
        await prisma.coupon.update({
          where: { code: result.data.couponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      if (sell?.productSells) {
        const productUpdatePromises = sell.productSells.map(
          async (productSell: ProductSell) => {
            const productData = await ProductModel.findById(
              productSell.productId
            );

            if (!productData) {
              throw new Error(
                `Product with ID ${productSell.productId} not found`
              );
            }

            await prisma.inventory.updateMany({
              where: {
                productId: productSell.productId,
                colorId: productSell.colorId,
                sizeId: productSell.sizeId,
              },
              data: {
                quantity: {
                  decrement: productSell.quantity,
                },
              },
            });

            return productData;
          }
        );

        if (productUpdatePromises.length > 0) {
          await Promise.all(productUpdatePromises);
        }
      }

      res
        .status(201)
        .json(
          SellPresenter.formatSuccess(
            SellPresenter.formatSell(sell),
            "Sale created successfully"
          )
        );
    } catch (error) {
      console.error("Error in createSell:", error);
      res.status(500).json(SellPresenter.formatError(error));
    }
  },

  updateSell: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);
      const result = updateSellSchema.safeParse({ ...req.body, id });

      if (!result.success) {
        res.status(400).json(SellPresenter.formatError(result.error));
        return;
      }

      const sell = await SellModel.update(result.data as Sell);
      res
        .status(200)
        .json(
          SellPresenter.formatSuccess(
            SellPresenter.formatSell(sell),
            "Sale updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },

  deleteSell: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);

      if (!id) {
        res
          .status(400)
          .json(SellPresenter.formatError({ message: "Sale ID is required" }));
        return;
      }

      const sell = await SellModel.delete(id);
      res
        .status(200)
        .json(
          SellPresenter.formatSuccess(
            SellPresenter.formatSell(sell),
            "Sale deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },

  getSellById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);

      if (!id) {
        res
          .status(400)
          .json(SellPresenter.formatError({ message: "Sale ID is required" }));
        return;
      }

      const sell = await SellModel.findById(id);
      res
        .status(200)
        .json(
          SellPresenter.formatSuccess(
            SellPresenter.formatSell(sell),
            "Sale retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },

  getAllSells: async (req: Request, res: Response): Promise<void> => {
    try {
      const sells = await SellModel.findAll();
      res
        .status(200)
        .json(
          SellPresenter.formatSuccess(
            SellPresenter.formatSellList(sells),
            "Sales retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },

  getSellsByAuthenticatedUser: async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res
          .status(401)
          .json(
            SellPresenter.formatError({ message: "User not authenticated" })
          );
        return;
      }

      const userId = req.user.customer?.id;
      const sells = await SellModel.findByCustomerId(userId as string);

      res
        .status(200)
        .json(
          SellPresenter.formatSuccess(
            SellPresenter.formatSellList(sells),
            "User sales retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },

  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);
      const status = req.body?.status;
      if (!id || !status) {
        res
          .status(400)
          .json(SellPresenter.formatError({ message: "Faltan datos" }));
        return;
      }
      const sell = await SellModel.updateStatus(id, status);
      res
        .status(200)
        .json(SellPresenter.formatSuccess(sell, "Estado actualizado"));
    } catch (error) {
      res.status(400).json(SellPresenter.formatError(error));
    }
  },

  cancelSell: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = paramString(req.params.id);
      if (!id) {
        res
          .status(400)
          .json(SellPresenter.formatError({ message: "Falta el id" }));
        return;
      }
      const sell = await SellModel.cancel(id);
      res.status(200).json(SellPresenter.formatSuccess(sell, "Venta anulada"));
    } catch (error) {
      res.status(400).json(SellPresenter.formatError(error));
    }
  },

  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await SellModel.getMonthlyStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },
};
