import { checkAdminKey } from "@/lib/checkAdminKey";
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { updateProduct } from "@/query/products/updateProduct/handler";
import { updateProductSchema } from "@/query/products/updateProduct/schema";
import { deleteProduct } from "@/query/products/deleteProduct/handler";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<API.Response<Products.UpdateProduct>> {
  try {
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Requisição de Produto inválida");
    }

    const result = await updateProduct(Number(params.id), parsed.data);
    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<API.Response<Products.DeleteProduct>> {
  try {
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const result = await deleteProduct(Number(params.id));
    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
