import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User, UserModel } from "../users/models";
import { RegisterUserDto, LoginUserDto } from "./dto/auth.dto";
import { UserPresenter } from "../users/presenters";

// IMPORTANT: Store these securely, preferably in environment variables!
const JWT_SECRET: string =
  process.env.JWT_SECRET || "your-super-secret-key-please-change-immediately";
const JWT_EXPIRES_IN_SECONDS: number = 3600; // 1 hour in seconds

export class AuthService {
  static async register(
    userData: RegisterUserDto
  ): Promise<Partial<User> | null> {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists"); // Or handle as a proper HTTP error in controller
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUserInput: User = {
      ...userData,
      password: hashedPassword,
      // Ensure all required fields for User (excluding optionals like id, createdAt, updatedAt, customer, employee) are present
      // If RegisterUserDto doesn't include all non-optional base User fields, this will error
      // For example, if User requires 'userType', 'identificationType', etc., and they are in RegisterUserDto, it's fine.
    };

    const createdUser = await UserModel.create(newUserInput);
    return UserPresenter.formatUser(createdUser); // Use presenter to strip password and handle types
  }

  static async login(
    credentials: LoginUserDto
  ): Promise<{ token: string; user: Partial<User> | null } | null> {
    const userFromDb = await UserModel.findByEmail(credentials.email);
    if (!userFromDb || !userFromDb.password) {
      // Also check if user.password exists
      return null; // User not found or password not set
    }

    const isPasswordMatch = await bcrypt.compare(
      credentials.password,
      userFromDb.password
    );
    if (!isPasswordMatch) {
      return null; // Invalid credentials
    }

    const userForToken: Partial<User> | null =
      UserPresenter.formatUser(userFromDb);
    if (!userForToken || !userForToken.id || !userForToken.email) {
      return null; // Should not happen if user was found and formatted
    }

    const payload = {
      id: userForToken.id,
      email: userForToken.email,
      // Add other claims as needed, e.g., roles
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN_SECONDS,
    });

    return { token, user: userForToken };
  }
}
