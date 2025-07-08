import { createRouteHandler } from "@/query/core/createRouteHandler";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { checkCartIntegrity } from "@/query/products/checkCartIntegrity/handler";
import { checkCartIntegritySchema } from "@/query/products/checkCartIntegrity/schema";
import { NextRequest } from "next/server";

async function getHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slugs = searchParams.getAll("productSlugs") || null;

  const parsed = checkCartIntegritySchema.safeParse({
    productSlugs: slugs,
  });

  if (!parsed.success) {
    throw new BadRequestError("Parâmetros inválidos.");
  }

  const { productSlugs } = parsed.data;

  return await checkCartIntegrity({
    productSlugs,
  });
}

export const GET = createRouteHandler(getHandler);
