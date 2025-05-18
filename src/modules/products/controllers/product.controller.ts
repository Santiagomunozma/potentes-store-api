import { Request, Response } from "express";
import { createProductSchema, updateProductSchema } from "../validations";
import { Product, ProductModel } from "../models";
import { ProductPresenter } from "../presenters";

export const ProductController = {
  createProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Creating product...", req.body);
      const result = createProductSchema.safeParse({
        ...req.body,
        inventory: req.body.inventory.map((inventory: any) => ({
          sizeId: inventory.size,
          colorId: inventory.color,
          quantity: inventory.stock,
        })),
      });

      if (!result.success) {
        res.status(400).json(ProductPresenter.formatError(result.error));
        return;
      }

      const product = await ProductModel.create(result.data as Product);
      res
        .status(201)
        .json(
          ProductPresenter.formatSuccess(
            ProductPresenter.formatProduct(product),
            "Product created successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ProductPresenter.formatError(error));
    }
  },

  updateProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = updateProductSchema.safeParse({
        ...req.body,
        id,
        inventory: req.body.inventory.map((inventory: any) => ({
          sizeId: inventory.size,
          colorId: inventory.color,
          quantity: inventory.stock,
        })),
      });

      if (!result.success) {
        res.status(400).json(ProductPresenter.formatError(result.error));
        return;
      }

      const product = await ProductModel.update(result.data as Product);
      res
        .status(200)
        .json(
          ProductPresenter.formatSuccess(
            ProductPresenter.formatProduct(product),
            "Product updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ProductPresenter.formatError(error));
    }
  },

  deleteProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(
            ProductPresenter.formatError({ message: "Product ID is required" })
          );
        return;
      }

      const product = await ProductModel.delete(id);
      res
        .status(200)
        .json(
          ProductPresenter.formatSuccess(
            ProductPresenter.formatProduct(product),
            "Product deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ProductPresenter.formatError(error));
    }
  },

  getProductById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(
            ProductPresenter.formatError({ message: "Product ID is required" })
          );
        return;
      }

      const product = await ProductModel.findById(id);
      res
        .status(200)
        .json(
          ProductPresenter.formatSuccess(
            ProductPresenter.formatProduct(product),
            "Product retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ProductPresenter.formatError(error));
    }
  },

  getAllProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await ProductModel.findAll();
      res
        .status(200)
        .json(
          ProductPresenter.formatSuccess(
            ProductPresenter.formatProductList(products),
            "Products retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ProductPresenter.formatError(error));
    }
  },

  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await ProductModel.getMonthlyStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json(ProductPresenter.formatError(error));
    }
  },
};
