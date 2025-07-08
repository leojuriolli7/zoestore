import { NextRequest } from "next/server";
import { loginWithAdminKey } from "@/query/authentication/loginWithAdminKey/handler";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { loginWithAdminKeySchema } from "@/query/authentication/loginWithAdminKey/schema";
import { createRouteHandler } from "@/query/core/createRouteHandler";

async function postHandler(req: NextRequest) {
  const body = await req.json();

  const parsed = loginWithAdminKeySchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Requisição de Login inválida");
  }

  return await loginWithAdminKey({
    password: parsed.data.password,
  });
}

export const POST = createRouteHandler(postHandler);
