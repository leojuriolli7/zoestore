import { getProductByIdOptions } from "@/query/products/getProductById/query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ProductPage } from "@/components/pages/ProductPage";

const queryClient = new QueryClient();

export default async function ProductById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await queryClient.prefetchQuery(getProductByIdOptions(Number(id)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductPage />
    </HydrationBoundary>
  );
}
