import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { listProducts } from "@/query/products/listProducts/handler";
import { listProductsSchema } from "@/query/products/listProducts/schema";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest
): Promise<API.Response<Products.ListProducts>> {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") || null;
    const limit = searchParams.get("limit") || null;

    const parsed = listProductsSchema.safeParse({ cursor, limit });

    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }

    const { cursor: parsedCursor, limit: parsedLimit } = parsed.data;

    const result = await listProducts({
      cursor: parsedCursor,
      limit: parsedLimit,
    });

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
