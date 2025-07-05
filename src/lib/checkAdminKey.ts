import "server-only";

import { appConfig } from "@/config";
import { cookies } from "next/headers";

export async function checkAdminKey() {
  const cookiesStore = await cookies();

  /** Authorization is based on the `admin_key` cookie. */
  const hasAdminCookie =
    cookiesStore.get(appConfig.auth.adminKeyCookieName)?.value ===
    process.env.ADMIN_KEY;

  return { isAdmin: hasAdminCookie };
}
