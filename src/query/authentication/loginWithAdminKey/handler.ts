import "server-only";

import { appServerConfig } from "@/config/server";
import { A_YEAR } from "@/lib/time";
import { cookies } from "next/headers";
import { LoginWithAdminKeySchema } from "./schema";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { Authentication } from "../types";

/** Server handler. */
export async function loginWithAdminKey({
  password,
}: LoginWithAdminKeySchema): Promise<Authentication.LoginWithAdminKey> {
  if (password !== appServerConfig.auth.adminKey) {
    throw new UnauthorizedError("Senha incorreta.");
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: appServerConfig.auth.adminKeyCookieName,
    expires: Date.now() + A_YEAR,
    value: password,
    sameSite: "none",
    secure: true,
  });

  return { success: true };
}
