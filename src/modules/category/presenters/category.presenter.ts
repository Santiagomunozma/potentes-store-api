export const CategoryPresenter = {
  formatCategory: (category: unknown) => category,
  formatCategoryList: (categories: unknown[]) => categories ?? [],
  formatError: (error: { message?: string }) => ({
    error: error.message || "An error occurred",
    status: "error",
  }),
  formatSuccess: (data: unknown, message = "Operation successful") => ({
    data,
    message,
    status: "success",
  }),
};
