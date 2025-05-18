import { User } from "../../users/models";

export type RegisterUserDto = Pick<
  User,
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "phone"
  | "userType"
  | "identificationType"
  | "identificationNumber"
>;

export type LoginUserDto = Pick<User, "email" | "password">;
