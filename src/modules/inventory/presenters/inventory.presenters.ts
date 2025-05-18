import { Inventory } from "../models";

export const InventoryPresenter = {
  formatInventory: (inventory: any): Partial<Inventory> | null => {
    if (!inventory) return null;
    return inventory;
  },

  formatInventoryList: (inventories: any[]): Partial<Inventory>[] => {
    if (!inventories || !inventories.length) return [];
    return inventories;
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
