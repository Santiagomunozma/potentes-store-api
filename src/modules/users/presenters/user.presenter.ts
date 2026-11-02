import { User } from "../models";

export const UserPresenter = {
  formatUser: (user: any): Partial<User> | null => {
    if (!user) return null;

    // Exclude sensitive information like password
    const { password, ...safeUser } = user;
    return {
      ...safeUser,
      purchaseCount: user.customer?._count?.sells ?? 0,
      salesCount: user.employee?._count?.sells ?? 0,
    };
  },

  formatUserList: (users: any[]): Partial<User>[] => {
    if (!users || !users.length) return [];

    return users.map((user) => UserPresenter.formatUser(user)!);
  },

  formatError: (error: any) => {
    return {
      error: error.message || "An error occurred",
      status: "error",
    };
  },

  formatSuccess: (data: any, message: string = "Operation successful") => {
    return {
      data,
      message,
      status: "success",
    };
  },
};
