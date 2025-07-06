export const keys = {
  base: ["products"],
  listProducts: ["products", "listProducts"],
  getBySlug: (slug: string) => ["products", { slug }],
  addProduct: ["products", "addProduct"],
  updateProduct: (slug: string) => ["products", "updateProduct", { slug }],
  deleteProduct: ["products", "deleteProduct"],
};
