import { API } from "../core/query";

export declare namespace Products {
  type Tag = {
    id: number;
    name: string;
  };

  type Product = {
    id: number;
    name: string;
    image_url: string;
    description: string | null;
    price: string;
    tags: Tag[];
  };

  type ListProducts = API.InfiniteListResult<Products.Product>;

  type AddProduct = { success: boolean; product: Product };

  type UpdateProduct = { success: boolean; product: Product };

  type DeleteProduct = { success: boolean };
}
