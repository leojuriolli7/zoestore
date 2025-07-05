import "server-only";

import { appConfig } from "@/config";
import { A_YEAR } from "@/lib/time";
import { cookies } from "next/headers";
import { LoginWithAdminKeySchema } from "./schema";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { Authentication } from "../types";

/** Server handler. */
export async function loginWithAdminKey({
  password,
}: LoginWithAdminKeySchema): Promise<Authentication.LoginWithAdminKey> {
  if (password !== process.env.ADMIN_KEY) {
    throw new UnauthorizedError("Senha incorreta.");
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: appConfig.auth.adminKeyCookieName,
    expires: Date.now() + A_YEAR,
    value: password,
    sameSite: "none",
    secure: true,
  });

  return { success: true };
}
