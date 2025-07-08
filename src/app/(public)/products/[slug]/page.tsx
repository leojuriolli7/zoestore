import { ProductPage } from "@/components/pages/ProductPage";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";
import { listProducts } from "@/query/products/listProducts/handler";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: `ZOE STORE | ${product.name}`,
        ...(product.description && { description: product.description }),
        images: [
          {
            url: product.image_url,
            width: 366,
            height: 550,
            alt: `Uma modelo vestindo "${product.name}"`,
          },
        ],
      },
      twitter: {
        card: "summary",
        title: `ZOE STORE | ${product.name}`,
        ...(product.description && { description: product.description }),
        images: [product.image_url],
      },
    };
  } catch (error) {
    console.error("[metadata]", error);
    return {};
  }
}

export default async function ProductById({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug).catch(notFound);

  return <ProductPage product={product} />;
}
