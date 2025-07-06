import { ProductPage } from "@/components/pages/ProductPage";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";

export default async function ProductById({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  return <ProductPage product={product} />;
}
