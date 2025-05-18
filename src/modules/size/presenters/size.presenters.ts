import { Size } from "../models";

export const SizePresenter = {
  formatSize: (size: any): Partial<Size> | null => {
    if (!size) return null;
    return size;
  },

  formatSizeList: (sizes: any[]): Partial<Size>[] => {
    if (!sizes || !sizes.length) return [];
    return sizes;
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
