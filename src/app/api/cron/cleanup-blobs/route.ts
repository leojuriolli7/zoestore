import { list, del, type ListBlobResult } from "@vercel/blob";
import { db } from "@/query/db";
import { productMedias } from "@/query/db/schema";
import { inArray } from "drizzle-orm";
import { NextRequest } from "next/server";
import { appServerConfig } from "@/config/server";

/**
 * This route will run via Cron Job every Sunday at 2AM.
 *
 * It will fetch all blobs from the vercel blob store and all product media from the database,
 * and check if any media file isn't attached to a product in the database.
 *
 * Every unused media file will be deleted from the store.
 */

interface DeletionResult {
  url: string;
  success: boolean;
  error?: string;
}

interface CleanupResponse {
  success: boolean;
  message: string;
  totalBlobs: number;
  unusedBlobs: number;
  deletedCount: number;
  failedDeletions: number;
}

interface ErrorResponse {
  success: false;
  error: string;
  details: string;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${appServerConfig.auth.cronSecret}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    console.log("Starting optimized blob cleanup job...");

    const { blobs }: ListBlobResult = await list();
    console.log(`Found ${blobs.length} blobs to check`);

    if (blobs.length === 0) {
      const response: CleanupResponse = {
        success: true,
        message: "No blobs found",
        totalBlobs: 0,
        unusedBlobs: 0,
        deletedCount: 0,
        failedDeletions: 0,
      };
      return Response.json(response);
    }

    const blobUrls = blobs.map((blob) => blob.url);
    const unusedBlobUrls = await findUnusedBlobs(blobUrls);

    console.log(
      `Found ${unusedBlobUrls.length} unused blobs out of ${blobs.length} total`
    );

    if (unusedBlobUrls.length === 0) {
      const response: CleanupResponse = {
        success: true,
        message: "No unused blobs found",
        totalBlobs: blobs.length,
        unusedBlobs: 0,
        deletedCount: 0,
        failedDeletions: 0,
      };
      return Response.json(response);
    }

    const deletionResults = await deleteUnusedBlobsInBatches(unusedBlobUrls);

    const successfulDeletions = deletionResults.filter(
      (result) => result.success
    ).length;

    console.log(
      `Successfully deleted ${successfulDeletions}/${unusedBlobUrls.length} unused blobs`
    );

    const response: CleanupResponse = {
      success: true,
      message: `Cleanup completed. Deleted ${successfulDeletions} unused blobs.`,
      totalBlobs: blobs.length,
      unusedBlobs: unusedBlobUrls.length,
      deletedCount: successfulDeletions,
      failedDeletions: unusedBlobUrls.length - successfulDeletions,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Blob cleanup job failed:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Blob cleanup job failed",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return Response.json(errorResponse, { status: 500 });
  }
}

async function findUnusedBlobs(blobUrls: string[]): Promise<string[]> {
  const BATCH_SIZE = 500;
  const unusedUrls: string[] = [];

  for (let i = 0; i < blobUrls.length; i += BATCH_SIZE) {
    const batch = blobUrls.slice(i, i + BATCH_SIZE);

    console.log(
      `Checking existence for batch ${
        Math.floor(i / BATCH_SIZE) + 1
      }/${Math.ceil(blobUrls.length / BATCH_SIZE)}`
    );

    // Get all used URLs in this batch with a single query
    const usedUrls = await db
      .select({ url: productMedias.url })
      .from(productMedias)
      .where(inArray(productMedias.url, batch));

    const usedUrlsSet = new Set(usedUrls.map((row) => row.url));
    const batchUnusedUrls = batch.filter((url) => !usedUrlsSet.has(url));

    unusedUrls.push(...batchUnusedUrls);

    console.log(`Found ${batchUnusedUrls.length} unused URLs in this batch`);
  }

  return unusedUrls;
}

/**
 * Delete blobs in parallel batches to improve performance
 * while avoiding overwhelming the blob storage API
 */
async function deleteUnusedBlobsInBatches(
  unusedBlobUrls: string[]
): Promise<DeletionResult[]> {
  const CONCURRENT_DELETIONS = 10;
  const results: DeletionResult[] = [];

  for (let i = 0; i < unusedBlobUrls.length; i += CONCURRENT_DELETIONS) {
    const batch = unusedBlobUrls.slice(i, i + CONCURRENT_DELETIONS);

    console.log(
      `Deleting batch ${Math.floor(i / CONCURRENT_DELETIONS) + 1}/${Math.ceil(
        unusedBlobUrls.length / CONCURRENT_DELETIONS
      )} (${batch.length} blobs)`
    );

    const batchPromises = batch.map(
      async (url: string): Promise<DeletionResult> => {
        try {
          await del(url);
          console.log(`✓ Deleted: ${url}`);
          return { url, success: true };
        } catch (error) {
          console.error(`✗ Failed to delete ${url}:`, error);
          return {
            url,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }
    );

    const batchResults = await Promise.allSettled(batchPromises);

    const batchProcessedResults: DeletionResult[] = batchResults.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : { url: "unknown", success: false, error: "Promise rejected" }
    );

    results.push(...batchProcessedResults);

    // Small delay between batches to be gentle on the API
    if (i + CONCURRENT_DELETIONS < unusedBlobUrls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}
