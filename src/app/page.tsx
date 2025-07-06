import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { listProductsOptions } from "@/query/products/listProducts/query";
import { Homepage } from "@/pages/Homepage";

export default async function Index() {
  const client = new QueryClient();

  await client.prefetchInfiniteQuery(listProductsOptions({ limit: 20 }));

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Homepage />
    </HydrationBoundary>
  );
}
