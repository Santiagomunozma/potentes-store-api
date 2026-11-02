import { Request, Response } from "express";
import { paramString } from "../../../utils/routeParams";
import { CategoryModel, Category } from "../models/category.model";
import { CategoryPresenter } from "../presenters/category.presenter";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

export const CategoryController = {
  createCategory: async (req: Request, res: Response): Promise<void> => {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json(CategoryPresenter.formatError(result.error));
      return;
    }
    const category = await CategoryModel.create(result.data as Category);
    res
      .status(201)
      .json(
        CategoryPresenter.formatSuccess(
          category,
          "Categoría creada"
        )
      );
  },

  updateCategory: async (req: Request, res: Response): Promise<void> => {
    const id = paramString(req.params.id);
    const result = updateCategorySchema.safeParse({ ...req.body, id });
    if (!result.success) {
      res.status(400).json(CategoryPresenter.formatError(result.error));
      return;
    }
    const category = await CategoryModel.update(result.data as Category);
    res
      .status(200)
      .json(CategoryPresenter.formatSuccess(category, "Categoría actualizada"));
  },

  deleteCategory: async (req: Request, res: Response): Promise<void> => {
    const id = paramString(req.params.id);
    if (!id) {
      res
        .status(400)
        .json(CategoryPresenter.formatError({ message: "Falta el id" }));
      return;
    }
    const category = await CategoryModel.delete(id);
    res
      .status(200)
      .json(CategoryPresenter.formatSuccess(category, "Categoría eliminada"));
  },

  getAllCategories: async (_req: Request, res: Response): Promise<void> => {
    const categories = await CategoryModel.findAll();
    res
      .status(200)
      .json(CategoryPresenter.formatSuccess(categories, "Categorías"));
  },
};
