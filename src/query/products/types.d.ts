import { API } from "../core/query";

export declare namespace Products {
  type Tag = {
    id: number;
    name: string;
  };

  type Media = {
    id: number;
    url: string;
    altText: string | null;
    sortOrder: number;
    isPrimary: boolean;
    createdAt: Date;
  };

  type Product = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    name: string;
    medias: Media[];
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
    productImage: string | null;
    productImageAlt?: string | null;
  };

  type ListHomepageTags = { tags: HomepageTag[] };

  type CardIntegrityStatus = {
    valid: string[];
    invalid: string[];
  };
}
