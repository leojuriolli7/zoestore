import { ProductPage } from "@/components/pages/ProductPage";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";
import { listProducts } from "@/query/products/listProducts/handler";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await listProducts({
    limit: 999,
    cursor: null,
    search: null,
    tags: [],
  });

  return products.results.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductById({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  return <ProductPage product={product} />;
}
