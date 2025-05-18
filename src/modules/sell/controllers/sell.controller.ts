import { Request, Response } from "express";
import { createSellSchema, updateSellSchema } from "../validations";
import { Sell, SellModel } from "../models";
import { SellPresenter } from "../presenters";
import { Product, ProductModel } from "../../products/models";
import { AuthenticatedRequest } from "../../auth/middleware/auth.middleware";

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

      const sell = await SellModel.create(result.data as Sell);

      if (sell?.productSells) {
        const productUpdatePromises = sell.productSells.map(
          async (productSell) => {
            const productData = await ProductModel.findById(
              productSell.productId
            );

            if (!productData) {
              throw new Error(
                `Product with ID ${productSell.productId} not found`
              );
            }

            return ProductModel.updateProductOnly({
              id: productSell.productId,
              sku: productData.sku,
              status: productData.status,
              name: productData.name,
              careInstructions: productData.careInstructions,
              imageUrl: productData.imageUrl,
              description: productData.description,
              price: productData.price,
            });
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
      const { id } = req.params;
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
      const { id } = req.params;

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
      const { id } = req.params;

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

  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await SellModel.getMonthlyStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json(SellPresenter.formatError(error));
    }
  },
};
