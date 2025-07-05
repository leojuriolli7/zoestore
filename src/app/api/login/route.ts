import { NextRequest } from "next/server";
import { loginWithAdminKey } from "@/query/authentication/loginWithAdminKey/handler";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { loginWithAdminKeySchema } from "@/query/authentication/loginWithAdminKey/schema";
import { API } from "@/query/core/query";
import { Authentication } from "@/query/authentication/types";

export async function POST(
  req: NextRequest
): Promise<API.Response<Authentication.LoginWithAdminKey>> {
  try {
    const body = await req.json();

    const parsed = loginWithAdminKeySchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError("Requisição de Login inválida");
    }

    const { success } = await loginWithAdminKey({
      password: parsed.data.password,
    });

    return parseSuccessResponse({ success });
  } catch (error) {
    return parseErrorResponse(error);
  }
}
