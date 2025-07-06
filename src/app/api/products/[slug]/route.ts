import { checkAdminKey } from "@/lib/checkAdminKey";
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { updateProduct } from "@/query/products/updateProduct/handler";
import { updateProductSchema } from "@/query/products/updateProduct/schema";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<API.Response<Products.UpdateProduct>> {
  try {
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Requisição de Produto inválida");
    }

    const { slug } = await params;

    const result = await updateProduct(slug, parsed.data);
    revalidatePath(`/products/${result.product.slug}`);

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<API.Response<Products.Product | null>> {
  try {
    const { slug } = await params;

    if (!slug) throw new BadRequestError("Slug inválido.");

    const product = await getProductBySlug(slug);
    return parseSuccessResponse(product);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
