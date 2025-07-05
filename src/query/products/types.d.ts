import { API } from "../core/query";

export declare namespace Products {
  type Product = {
    id: number;
    name: string;
    image_url: string;
    description: string | null;
    price: string;
  };

  type ListProducts = API.InfiniteListResult<Products.Product>;
}
