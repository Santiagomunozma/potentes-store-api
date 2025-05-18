import { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "../validations";
import { User, UserModel } from "../models";
import { UserPresenter } from "../presenters";
import * as bcrypt from "bcrypt";

export const UserController = {
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = createUserSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json(UserPresenter.formatError(result.error));
        return;
      }

      const userData = result.data as User;
      if (userData.password) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }

      const user = await UserModel.create(userData);

      res
        .status(201)
        .json(
          UserPresenter.formatSuccess(
            UserPresenter.formatUser(user),
            "User created successfully"
          )
        );
    } catch (error) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  },

  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = updateUserSchema.safeParse({ ...req.body, id });

      if (!result.success) {
        res.status(400).json(UserPresenter.formatError(result.error));
        return;
      }

      const user = await UserModel.update(result.data as User);
      res
        .status(200)
        .json(
          UserPresenter.formatSuccess(
            UserPresenter.formatUser(user),
            "User updated successfully"
          )
        );
    } catch (error) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(UserPresenter.formatError({ message: "User ID is required" }));
        return;
      }

      const user = await UserModel.delete(id);
      res
        .status(200)
        .json(
          UserPresenter.formatSuccess(
            UserPresenter.formatUser(user),
            "User deleted successfully"
          )
        );
    } catch (error) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  },

  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res
          .status(400)
          .json(UserPresenter.formatError({ message: "User ID is required" }));
        return;
      }

      const user = await UserModel.findById(id);
      res
        .status(200)
        .json(
          UserPresenter.formatSuccess(
            UserPresenter.formatUser(user),
            "User retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  },

  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await UserModel.findAll();
      res
        .status(200)
        .json(
          UserPresenter.formatSuccess(
            UserPresenter.formatUserList(users),
            "Users retrieved successfully"
          )
        );
    } catch (error) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  },
};
