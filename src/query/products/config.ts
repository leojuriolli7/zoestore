export const keys = {
  base: ["products"],
  listProducts: ["products", "listProducts"],
  getById: (id: number) => ["products", { id }],
  addProduct: ["products", "addProduct"],
  updateProduct: (id: number) => ["products", "updateProduct", { id }],
  deleteProduct: ["products", "deleteProduct"],
};
