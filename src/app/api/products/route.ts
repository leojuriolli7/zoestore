import { checkAdminKey } from "@/lib/checkAdminKey";
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { addProduct } from "@/query/products/addProduct/handler";
import { addProductSchema } from "@/query/products/addProduct/schema";
import { deleteProduct } from "@/query/products/deleteProduct/handler";
import { deleteProductsSchema } from "@/query/products/deleteProduct/schema";
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
    const search = searchParams.get("search") || null;

    const parsed = listProductsSchema.safeParse({ cursor, limit, search });

    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }

    const {
      cursor: parsedCursor,
      limit: parsedLimit,
      search: parsedSearch,
    } = parsed.data;

    const result = await listProducts({
      cursor: parsedCursor,
      limit: parsedLimit,
      search: parsedSearch,
    });

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}

export async function POST(
  req: NextRequest
): Promise<API.Response<Products.AddProduct>> {
  try {
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = addProductSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Requisição de Produto inválida");
    }

    const result = await addProduct(parsed.data);
    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest
): Promise<API.Response<Products.DeleteProduct>> {
  try {
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = deleteProductsSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError();
    }

    const result = await deleteProduct({ ids: parsed.data.ids });
    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
