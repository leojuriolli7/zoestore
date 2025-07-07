import { appServerConfig } from "@/config/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/query/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: appServerConfig.db.url,
  },
});
