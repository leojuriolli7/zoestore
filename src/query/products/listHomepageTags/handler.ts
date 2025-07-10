import "server-only";

import { db } from "@/query/db";
import type { Products } from "../types";
import { desc, eq, sql, asc } from "drizzle-orm";
import { products, productTags, tags, productMedias } from "@/query/db/schema";

/**
 * Server-side fetch function to get the top 4 tags for the homepage.
 *
 * This handler identifies the four tags associated with the most products.
 * For each of these tags, it retrieves the first media of the most recent product.
 * To ensure variety, it attempts to assign a unique product to each tag.
 * If a unique product isn't available for a tag, it defaults to that tag's
 * most recent product.
 *
 * @returns A promise that resolves to an object containing the list of homepage tags.
 */
export async function listHomepageTags(): Promise<Products.ListHomepageTags> {
  // 1. Get top 4 tags by product count with their most recent products and first media
  const topTagsWithProducts = await db
    .select({
      tagId: tags.id,
      tagName: tags.name,
      productId: products.id,
      productCreatedAt: products.createdAt,
      mediaUrl: productMedias.url,
      mediaAltText: productMedias.altText,
      mediaSortOrder: productMedias.sortOrder,
      mediaIsPrimary: productMedias.isPrimary,
    })
    .from(
      db
        .select({
          tagId: productTags.tagId,
          productCount: sql<number>`count(*)`.as("product_count"),
        })
        .from(productTags)
        .groupBy(productTags.tagId)
        .orderBy(desc(sql`count(*)`))
        .limit(4)
        .as("top_tags")
    )
    .innerJoin(tags, eq(sql`top_tags.tag_id`, tags.id))
    .innerJoin(productTags, eq(productTags.tagId, tags.id))
    .innerJoin(products, eq(productTags.productId, products.id))
    .leftJoin(productMedias, eq(productMedias.productId, products.id))
    .orderBy(
      tags.id,
      desc(products.createdAt),
      // Prioritize primary media, then by sort order
      desc(productMedias.isPrimary),
      asc(productMedias.sortOrder),
      asc(productMedias.id)
    );

  if (topTagsWithProducts.length === 0) {
    return { tags: [] };
  }

  // 2. Group by tag and select unique products with their first media
  const tagMap = new Map<
    number,
    {
      tagName: string;
      products: Array<{
        productId: number;
        createdAt: Date;
        mediaUrl: string | null;
        mediaAltText: string | null;
      }>;
    }
  >();

  for (const row of topTagsWithProducts) {
    if (!tagMap.has(row.tagId)) {
      tagMap.set(row.tagId, {
        tagName: row.tagName,
        products: [],
      });
    }

    const tagData = tagMap.get(row.tagId)!;

    // Check if we already have this product
    const existingProduct = tagData.products.find(
      (p) => p.productId === row.productId
    );

    if (!existingProduct) {
      tagData.products.push({
        productId: row.productId,
        createdAt: row.productCreatedAt,
        mediaUrl: row.mediaUrl,
        mediaAltText: row.mediaAltText,
      });
    } else if (!existingProduct.mediaUrl && row.mediaUrl) {
      // Update with first available media if we don't have one yet
      existingProduct.mediaUrl = row.mediaUrl;
      existingProduct.mediaAltText = row.mediaAltText;
    }
  }

  // 3. Select unique products for each tag
  const usedProductIds = new Set<number>();
  const finalTags: Products.HomepageTag[] = [];

  // Process tags in the order they were returned (by product count)
  const processedTagIds = new Set<number>();

  for (const row of topTagsWithProducts) {
    if (processedTagIds.has(row.tagId)) continue;
    processedTagIds.add(row.tagId);

    const tagData = tagMap.get(row.tagId);
    if (!tagData) continue;

    // Sort products by creation date (most recent first)
    tagData.products.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Find first unused product, or fallback to most recent
    const selectedProduct =
      tagData.products.find((p) => !usedProductIds.has(p.productId)) ||
      tagData.products[0];

    if (selectedProduct) {
      usedProductIds.add(selectedProduct.productId);
      finalTags.push({
        id: row.tagId,
        name: tagData.tagName,
        productImage: selectedProduct.mediaUrl,
        productImageAlt: selectedProduct.mediaAltText,
      });
    }
  }

  return {
    tags: finalTags,
  };
}
