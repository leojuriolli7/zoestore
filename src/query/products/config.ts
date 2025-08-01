export const productKeys = {
  base: ["products"],
  listProducts: ["products", "listProducts"],
  getBySlug: (slug: string) => ["products", { slug }],
  addProduct: ["products", "addProduct"],
  updateProduct: (slug: string) => ["products", "updateProduct", { slug }],
  deleteProduct: ["products", "deleteProduct"],
  listTags: ["products", "listTags"],
  listHomepageTags: ["products", "listTags", "homepage"],
  upsertTags: ["products", "upsertTags"],
  cartIntegrity: ["products", "cartIntegrity"],
};
