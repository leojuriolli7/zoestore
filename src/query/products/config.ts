export const keys = {
  base: ["products"],
  listProducts: ["products", "listProducts"],
  addProduct: ["products", "addProduct"],
  updateProduct: (id: number) => ["products", "updateProduct", { id }],
  deleteProduct: ["products", "deleteProduct"],
};
