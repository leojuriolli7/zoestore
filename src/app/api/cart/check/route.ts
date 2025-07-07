import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { checkCartIntegrity } from "@/query/products/checkCartIntegrity/handler";
import { checkCartIntegritySchema } from "@/query/products/checkCartIntegrity/schema";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest
): Promise<API.Response<Products.CardIntegrityStatus>> {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll("productIds") || null;

    const parsed = checkCartIntegritySchema.safeParse({
      productIds: ids,
    });

    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }

    const { productIds } = parsed.data;

    const result = await checkCartIntegrity({
      productIds,
    });

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
