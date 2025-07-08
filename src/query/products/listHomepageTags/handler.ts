import "server-only";

import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { Products } from "../types";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { products, productTags, tags } from "@/query/db/schema";

/**
 * Server-side fetch function to get the top 4 tags for the homepage.
 *
 * This handler identifies the four tags associated with the most products.
 * For each of these tags, it retrieves the image of the most recent product.
 * To ensure variety, it attempts to assign a unique product image to each tag.
 * If a unique product isn't available for a tag (e.g., all its recent products
 * are already displayed for other tags), it defaults to that tag's most recent product.
 *
 * @returns A promise that resolves to an object containing the list of homepage tags.
 */
export async function listHomepageTags(): Promise<Products.ListHomepageTags> {
  // 1. Identify the top 4 tags by product count
  const topTagsResult = await db
    .select({
      tagId: productTags.tagId,
    })
    .from(productTags)
    .groupBy(productTags.tagId)
    .orderBy(desc(sql`count(*)`))
    .limit(4);

  if (topTagsResult.length === 0) {
    return { tags: [] };
  }

  const topTagIds = topTagsResult.map((t) => t.tagId);

  // 2. Fetch all products for these top tags, ordered by latest
  const productsForTopTags = await db
    .select({
      tagId: productTags.tagId,
      productId: products.id,
      productImage: products.image_url,
      tagName: tags.name,
    })
    .from(productTags)
    .innerJoin(products, eq(productTags.productId, products.id))
    .innerJoin(tags, eq(productTags.tagId, tags.id))
    .where(inArray(productTags.tagId, topTagIds))
    .orderBy(desc(products.createdAt));

  // 3. Group products by tag to facilitate unique selection
  const productsByTag = new Map<
    number,
    { productId: number; productImage: string; tagName: string }[]
  >();

  for (const p of productsForTopTags) {
    if (!productsByTag.has(p.tagId)) {
      productsByTag.set(p.tagId, []);
    }
    productsByTag.get(p.tagId)!.push(p);
  }

  // 4. Select a unique product for each tag, maintaining tag popularity order
  const usedProductIds = new Set<number>();
  const finalTags: Products.HomepageTag[] = [];

  for (const tagId of topTagIds) {
    const productsForTag = productsByTag.get(tagId);
    if (!productsForTag) continue;

    const selectedProduct =
      productsForTag.find((p) => !usedProductIds.has(p.productId)) ||
      productsForTag[0]; // Fallback to the latest product

    if (selectedProduct) {
      usedProductIds.add(selectedProduct.productId);
      finalTags.push({
        id: tagId,
        name: selectedProduct.tagName,
        product_image: selectedProduct.productImage,
      });
    }
  }

  return {
    tags: finalTags,
  };
}
