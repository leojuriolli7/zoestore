import type { MetadataRoute } from "next";
import { listProducts } from "@/query/products/listProducts/handler";
import { listTags } from "@/query/products/listTags/handler";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const products = await listProducts({
      limit: 999,
      cursor: null,
      search: null,
      tags: [],
    });

    const productPages: MetadataRoute.Sitemap = products.results.map(
      (product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    const { tags } = await listTags();
    const tagListPages: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${baseUrl}/products?tag=${tag.name}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...tagListPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
