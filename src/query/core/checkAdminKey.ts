import "server-only";
import { appServerConfig } from "@/config/server";
import { cookies } from "next/headers";
import { decrypt } from "./crypto";

export async function checkAdminKey() {
  const cookiesStore = await cookies();
  const encryptedValue = cookiesStore.get(
    appServerConfig.auth.adminKeyCookieName
  )?.value;

  if (!encryptedValue) {
    return { isAdmin: false };
  }

  try {
    const decryptedValue = await decrypt(encryptedValue);
    const hasAdminCookie = decryptedValue === appServerConfig.auth.adminKey;
    return { isAdmin: hasAdminCookie };
  } catch (error) {
    console.log("[checkAdminKey]:", error);
    return { isAdmin: false };
  }
}
