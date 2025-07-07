import "server-only";

import { appServerConfig } from "@/config/server";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db: NodePgDatabase<typeof schema> = drizzle(
  appServerConfig.db.url,
  {
    schema,
  }
);
