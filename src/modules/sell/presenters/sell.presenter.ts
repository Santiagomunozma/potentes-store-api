import { Sell } from "../models";

export const SellPresenter = {
  formatSell: (sell: any): Partial<Sell> | null => {
    if (!sell) return null;
    return sell;
  },

  formatSellList: (sells: any[]): Partial<Sell>[] => {
    if (!sells || !sells.length) return [];
    return sells;
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
