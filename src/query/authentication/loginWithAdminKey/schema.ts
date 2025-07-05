import { z } from "zod";

/** Zod schema used for server and client validation. */

export const loginWithAdminKeySchema = z.object({
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginWithAdminKeySchema = z.infer<typeof loginWithAdminKeySchema>;
