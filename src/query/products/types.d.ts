import { API } from "../core/query";

export declare namespace Products {
  type Tag = {
    id: number;
    name: string;
  };

  type Product = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    name: string;
    image_url: string;
    description: string | null;
    price: string;
    tags: Tag[];
    slug: string;
  };

  type GetProductBySlug = Product;

  type ListProducts = API.InfiniteListResult<Products.Product>;

  type AddProduct = { success: boolean; product: Product };

  type UpdateProduct = { success: boolean; product: Product };

  type DeleteProduct = {
    success: boolean;
    products: Array<Omit<Product, "tags">>;
  };

  type ListTags = { tags: Tag[] };

  type UpsertTags = {
    success: boolean;
    affectedProducts: Array<{ slug: string }>;
    deletedTags: Array<{ id: number }>;
  };

  type HomepageTag = {
    id: number;
    name: string;
    product_image: string;
  };

  type ListHomepageTags = { tags: HomepageTag[] };

  type CardIntegrityStatus = {
    valid: string[];
    invalid: string[];
  };
}
