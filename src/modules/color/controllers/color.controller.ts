import { Request, Response } from "express";
import { ColorPresenter } from "../presenters";
import { createColorSchema, updateColorSchema } from "../validations";
import { Color, ColorModel } from "../models";

export const ColorController = {
  createColor: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Creating color...", req.body);
      const result = createColorSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json(ColorPresenter.formatError(result.error));
        return;
      }

      const color = await ColorModel.create(result.data as Color);
      res
        .status(201)
        .json(
          ColorPresenter.formatSuccess(
            ColorPresenter.formatColor(color),
            "Collor created successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ColorPresenter.formatError(error));
    }
  },

  updateColor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = updateColorSchema.safeParse({ ...req.body, id });

      if (!result.success) {
        res.status(400).json(ColorPresenter.formatError(result.error));
        return;
      }

      const color = await ColorModel.update(result.data as Color);
      res
        .status(200)
        .json(
          ColorPresenter.formatSuccess(
            ColorPresenter.formatColor(color),
            "Color updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ColorPresenter.formatError(error));
    }
  },

  deleteColor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(
            ColorPresenter.formatError({ message: "Color ID is required" })
          );
        return;
      }

      const color = await ColorModel.delete(id);
      res
        .status(200)
        .json(
          ColorPresenter.formatSuccess(
            ColorPresenter.formatColor(color),
            "Color deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ColorPresenter.formatError(error));
    }
  },

  getColorById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(
            ColorPresenter.formatError({ message: "Color ID is required" })
          );
        return;
      }

      const color = await ColorModel.findById(id);
      res
        .status(200)
        .json(
          ColorPresenter.formatSuccess(
            ColorPresenter.formatColor(color),
            "Color retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ColorPresenter.formatError(error));
    }
  },

  getAllColors: async (req: Request, res: Response): Promise<void> => {
    try {
      const colors = await ColorModel.findAll();
      res
        .status(200)
        .json(
          ColorPresenter.formatSuccess(
            ColorPresenter.formatColorList(colors),
            "Colors retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(ColorPresenter.formatError(error));
    }
  },
};
