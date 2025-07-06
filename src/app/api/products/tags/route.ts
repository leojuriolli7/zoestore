import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { listTags } from "@/query/products/listTags/handler";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";
import { checkAdminKey } from "@/lib/checkAdminKey";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { upsertTagsSchema } from "@/query/products/upsertTags/schema";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { upsertTags } from "@/query/products/upsertTags/handler";

export async function GET(): Promise<API.Response<Products.ListTags>> {
  try {
    const result = await listTags();

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}

export async function POST(
  req: NextRequest
): Promise<API.Response<Products.UpsertTags>> {
  try {
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = upsertTagsSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }

    const result = await upsertTags(parsed.data);

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
