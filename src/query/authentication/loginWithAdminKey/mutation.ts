import { keys } from "../config";
import type { LoginWithAdminKeySchema } from "./schema";
import type { Authentication } from "../types";
import { $fetch } from "../../core/fetch";

/** Client-side mutation. */
export const loginWithAdminKeyOptions = () => ({
  mutationKey: keys.loginWithAdminKey,
  mutationFn: (data: LoginWithAdminKeySchema) =>
    $fetch<Authentication.LoginWithAdminKey>("/api/login", {
      method: "POST",
      body: data,
    }),
});
