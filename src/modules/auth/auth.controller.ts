import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterUserDto, LoginUserDto } from "./dto/auth.dto";
import { UserPresenter } from "../users/presenters"; // For formatting responses
import { AuthenticatedRequest } from "./middleware/auth.middleware";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginUserDto = req.body as LoginUserDto;

      const result = await AuthService.login(loginUserDto);

      if (!result) {
        res
          .status(401)
          .json(
            UserPresenter.formatError({ message: "Invalid email or password" })
          );
        return;
      }

      res
        .status(200)
        .json(UserPresenter.formatSuccess(result, "Login successful"));
    } catch (error: any) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  }

  static async getProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // The user information is already attached to the request by the authenticateJWT middleware
      if (!req.user) {
        res
          .status(401)
          .json(
            UserPresenter.formatError({ message: "User not authenticated" })
          );
        return;
      }

      res
        .status(200)
        .json(
          UserPresenter.formatSuccess(
            req.user,
            "User profile retrieved successfully"
          )
        );
    } catch (error: any) {
      res.status(500).json(UserPresenter.formatError(error));
    }
  }
}
