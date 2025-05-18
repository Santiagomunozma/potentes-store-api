import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User, UserModel } from "../../users/models"; // Path to User model
import { UserPresenter } from "../../users/presenters"; // Added import

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-please-change-immediately";

// Extend Express Request type to include user property
export interface AuthenticatedRequest extends Request {
  user?: Partial<User>; // Kept as Partial<User> | undefined
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

      if (!decoded || !decoded.id) {
        res.status(403).json({ message: "Invalid token payload" });
        return;
      }

      const userFromDb = await UserModel.findById(decoded.id);
      if (!userFromDb) {
        res.status(403).json({ message: "User not found or token invalid" });
        return;
      }

      const formattedUser = UserPresenter.formatUser(userFromDb);
      req.user = formattedUser === null ? undefined : formattedUser;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
        return;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ message: "Invalid token" });
        return;
      }
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  } else {
    res.status(401).json({ message: "Authorization header is missing" });
    return;
  }
};
