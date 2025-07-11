import { ProductPage } from "@/components/pages/ProductPage";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";
import { listProducts } from "@/query/products/listProducts/handler";
import { Products } from "@/query/products/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productKeywords } from "./keywords";

export const revalidate = 86400;

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

const getProductKeywords = (product: Products.Product) => {
  return [
    ...productKeywords,
    product.name.toLowerCase(),
    ...(product.description
      ? product.description
          .toLowerCase()
          .split(" ")
          .filter((word) => word.length > 2)
          .slice(0, 10)
      : []),
    ...(product.tags?.map((tag) => tag.name.toLowerCase()) || []),
  ];
};

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
      keywords: Array.from(new Set(getProductKeywords(product))),
      openGraph: {
        title: `ZOE STORE | ${product.name}`,
        ...(product.description && { description: product.description }),
        images: [
          {
            url: product.medias[0].url,
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
        images: [product.medias[0].url],
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
