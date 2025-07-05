import "server-only";

import { appConfig } from "@/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db: NodePgDatabase<typeof schema> = drizzle(appConfig.db.url, {
  schema,
});
