import { checkAdminKey } from "@/query/core/checkAdminKey";
import { createRouteHandler } from "@/query/core/createRouteHandler";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { addProduct } from "@/query/products/addProduct/handler";
import { addProductSchema } from "@/query/products/addProduct/schema";
import { deleteProduct } from "@/query/products/deleteProduct/handler";
import { deleteProductsSchema } from "@/query/products/deleteProduct/schema";
import { listProducts } from "@/query/products/listProducts/handler";
import { listProductsSchema } from "@/query/products/listProducts/schema";
import { NextRequest } from "next/server";

async function getHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get("cursor") || null;
  const limit = searchParams.get("limit") || null;
  const search = searchParams.get("search") || null;
  const tags = searchParams.getAll("tags") || null;

  const parsed = listProductsSchema.safeParse({
    cursor,
    limit,
    search,
    tags,
  });

  if (!parsed.success) {
    throw new BadRequestError("Parâmetros inválidos.");
  }

  const {
    cursor: parsedCursor,
    limit: parsedLimit,
    search: parsedSearch,
    tags: parsedTags,
  } = parsed.data;

  return await listProducts({
    cursor: parsedCursor,
    limit: parsedLimit,
    search: parsedSearch,
    tags: parsedTags,
  });
}

async function postHandler(req: NextRequest) {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const body = await req.json();
  const parsed = addProductSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Requisição de Produto inválida");
  }

  return await addProduct(parsed.data);
}

async function deleteHandler(req: NextRequest) {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const body = await req.json();
  const parsed = deleteProductsSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError();
  }

  return await deleteProduct({ ids: parsed.data.ids });

  // Product was deleted, invalidate homepage cache.
  // revalidatePath(`/`);

  // result.products.forEach((p) => {
  //   revalidatePath(`/products/${p.slug}`);
  // });
}

export const GET = createRouteHandler(getHandler);
export const POST = createRouteHandler(postHandler);
export const DELETE = createRouteHandler(deleteHandler);
