import "server-only";

import { appServerConfig } from "@/config/server";
import { cookies } from "next/headers";

export async function checkAdminKey() {
  const cookiesStore = await cookies();

  /** Authorization is based on the `admin_key` cookie. */
  const hasAdminCookie =
    cookiesStore.get(appServerConfig.auth.adminKeyCookieName)?.value ===
    appServerConfig.auth.adminKey;

  return { isAdmin: hasAdminCookie };
}
