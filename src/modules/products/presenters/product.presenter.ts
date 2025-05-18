import { Product } from "../models";

export const ProductPresenter = {
  formatProduct: (product: any): Partial<Product> | null => {
    if (!product) return null;
    return product;
  },

  formatProductList: (products: any[]): Partial<Product>[] => {
    if (!products || !products.length) return [];
    return products;
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
