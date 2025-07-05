export const keys = {
  base: ["products"],
  listProducts: (limit: number) => ["products", "listProducts", { limit }],
  addProduct: ["products", "addProduct"],
};
