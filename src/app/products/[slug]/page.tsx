import { getProductBySlugOptions } from "@/query/products/getProductBySlug/query";
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await queryClient.prefetchQuery(getProductBySlugOptions(slug));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductPage />
    </HydrationBoundary>
  );
}
