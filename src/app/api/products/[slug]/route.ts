import type { NextRequest } from "next/server";
import { checkAdminKey } from "@/query/core/checkAdminKey";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { updateProduct } from "@/query/products/updateProduct/handler";
import { updateProductSchema } from "@/query/products/updateProduct/schema";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";
import { createRouteHandler } from "@/query/core/createRouteHandler";

type ProductRouteParams = { slug: string };

const postHandler = async (req: NextRequest, params: ProductRouteParams) => {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Requisição de Produto inválida");
  }

  const { slug } = params;

  return await updateProduct(slug, parsed.data);

  // When updating a product, revalidate that product's route cache
  // and homepage cache.
  // revalidatePath(`/products/${result.product.slug}`);
  // revalidatePath(`/`);
};

async function getHandler(req: NextRequest, params: ProductRouteParams) {
  const { slug } = params;

  if (!slug) throw new BadRequestError("Slug inválido.");

  return await getProductBySlug(slug);
}

export const POST = createRouteHandler(postHandler);
export const GET = createRouteHandler(getHandler);
