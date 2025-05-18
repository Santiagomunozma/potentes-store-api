import { Request, Response } from "express";
import { createSizeSchema, updateSizeSchema } from "../validations";
import { SizePresenter } from "../presenters";
import { Size, SizeModel } from "../models";

export const SizeController = {
  createSize: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Creating size...", req.body);
      const result = createSizeSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json(SizePresenter.formatError(result.error));
        return;
      }

      const size = await SizeModel.create(result.data as Size);
      res
        .status(201)
        .json(
          SizePresenter.formatSuccess(
            SizePresenter.formatSize(size),
            "Size created successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SizePresenter.formatError(error));
    }
  },

  updateSize: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = updateSizeSchema.safeParse({ ...req.body, id });

      if (!result.success) {
        res.status(400).json(SizePresenter.formatError(result.error));
        return;
      }

      const size = await SizeModel.update(result.data as Size);
      res
        .status(200)
        .json(
          SizePresenter.formatSuccess(
            SizePresenter.formatSize(size),
            "Size updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SizePresenter.formatError(error));
    }
  },

  deleteSize: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(SizePresenter.formatError({ message: "Size ID is required" }));
        return;
      }

      const size = await SizeModel.delete(id);
      res
        .status(200)
        .json(
          SizePresenter.formatSuccess(
            SizePresenter.formatSize(size),
            "Size deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SizePresenter.formatError(error));
    }
  },

  getSizeById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(SizePresenter.formatError({ message: "Size ID is required" }));
        return;
      }

      const size = await SizeModel.findById(id);
      res
        .status(200)
        .json(
          SizePresenter.formatSuccess(
            SizePresenter.formatSize(size),
            "Size fetched successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SizePresenter.formatError(error));
    }
  },

  getAllSizes: async (req: Request, res: Response): Promise<void> => {
    try {
      const sizes = await SizeModel.findAll();
      res
        .status(200)
        .json(
          SizePresenter.formatSuccess(
            SizePresenter.formatSizeList(sizes),
            "Sizes fetched successfully"
          )
        );
    } catch (error) {
      res.status(500).json(SizePresenter.formatError(error));
    }
  },
};
