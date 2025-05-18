import { Request, Response } from "express";
import { Inventory, InventoryModel } from "../models";
import { InventoryPresenter } from "../presenters";
import { createInventorySchema, updateInventorySchema } from "../validations";

export const InventoryController = {
  createInventory: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Creating inventory...", req.body);
      const result = createInventorySchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json(InventoryPresenter.formatError(result.error));
        return;
      }

      const inventory = await InventoryModel.create(result.data as Inventory);
      res
        .status(201)
        .json(
          InventoryPresenter.formatSuccess(
            InventoryPresenter.formatInventory(inventory),
            "Inventory created successfully"
          )
        );
    } catch (error) {
      res.status(500).json(InventoryPresenter.formatError(error));
    }
  },

  updateInventory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = updateInventorySchema.safeParse({ ...req.body, id });

      if (!result.success) {
        res.status(400).json(InventoryPresenter.formatError(result.error));
        return;
      }

      const inventory = await InventoryModel.update(result.data as Inventory);
      res
        .status(200)
        .json(
          InventoryPresenter.formatSuccess(
            InventoryPresenter.formatInventory(inventory),
            "Inventory updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(InventoryPresenter.formatError(error));
    }
  },

  deleteInventory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(
            InventoryPresenter.formatError({
              message: "Inventory ID is required",
            })
          );
        return;
      }

      const inventory = await InventoryModel.delete(id);
      res
        .status(200)
        .json(
          InventoryPresenter.formatSuccess(
            InventoryPresenter.formatInventory(inventory),
            "Inventory deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(InventoryPresenter.formatError(error));
    }
  },

  getInventoryById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(
            InventoryPresenter.formatError({
              message: "Inventory ID is required",
            })
          );
        return;
      }

      const inventory = await InventoryModel.findById(id);
      res
        .status(200)
        .json(
          InventoryPresenter.formatSuccess(
            InventoryPresenter.formatInventory(inventory),
            "Inventory retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(InventoryPresenter.formatError(error));
    }
  },

  getAllInventories: async (req: Request, res: Response): Promise<void> => {
    try {
      const inventories = await InventoryModel.findAll();
      res
        .status(200)
        .json(
          InventoryPresenter.formatSuccess(
            InventoryPresenter.formatInventoryList(inventories),
            "Inventories retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(InventoryPresenter.formatError(error));
    }
  },
};
