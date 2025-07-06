"use server";

import { appConfig } from "@/config";
import { cookies } from "next/headers";

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(appConfig.auth.adminKeyCookieName);
};
