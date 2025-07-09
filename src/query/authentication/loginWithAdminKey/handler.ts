import "server-only";
import { appServerConfig } from "@/config/server";
import { A_YEAR } from "@/lib/time";
import { cookies } from "next/headers";
import { LoginWithAdminKeySchema } from "./schema";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { Authentication } from "../types";
import { encrypt } from "@/query/core/crypto";

export async function loginWithAdminKey({
  password,
}: LoginWithAdminKeySchema): Promise<Authentication.LoginWithAdminKey> {
  if (password !== appServerConfig.auth.adminKey) {
    throw new UnauthorizedError("Senha incorreta.");
  }

  const cookieStore = await cookies();
  const encryptedPassword = await encrypt(password);

  cookieStore.set({
    name: appServerConfig.auth.adminKeyCookieName,
    expires: Date.now() + A_YEAR,
    httpOnly: true,
    value: encryptedPassword,
    sameSite: "none",
    secure: true,
  });

  return { success: true };
}
