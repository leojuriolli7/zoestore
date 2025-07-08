import { listTags } from "@/query/products/listTags/handler";
import { NextRequest } from "next/server";
import { checkAdminKey } from "@/lib/checkAdminKey";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { upsertTagsSchema } from "@/query/products/upsertTags/schema";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { upsertTags } from "@/query/products/upsertTags/handler";
import { createRouteHandler } from "@/query/core/createRouteHandler";

async function getHandler() {
  return await listTags();
}

async function postHandler(req: NextRequest) {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const body = await req.json();
  const parsed = upsertTagsSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Parâmetros inválidos.");
  }

  return await upsertTags(parsed.data);

  // A tag was deleted, so we invalidate the homepage cache.
  // if (result.deletedTags?.length > 0) {
  //   revalidatePath("/");
  // }

  // A product was affected (Tag added or removed), so we invalidate
  // that product's route cache.
  // result.affectedProducts.forEach((p) => {
  //   revalidatePath(`/products/${p.slug}`);
  // });
}

export const GET = createRouteHandler(getHandler);
export const POST = createRouteHandler(postHandler);
