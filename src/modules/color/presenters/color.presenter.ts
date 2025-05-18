import { Color } from "../models";

export const ColorPresenter = {
  formatColor: (color: any): Partial<Color> | null => {
    if (!color) return null;
    return color;
  },

  formatColorList: (colors: any[]): Partial<Color>[] => {
    if (!colors || !colors.length) return [];
    return colors;
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
