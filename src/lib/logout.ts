"use server";

import { appServerConfig } from "@/config/server";
import { cookies } from "next/headers";

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(appServerConfig.auth.adminKeyCookieName);
};
