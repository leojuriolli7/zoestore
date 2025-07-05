import { appConfig } from "@/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/query/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: appConfig.db.url,
  },
});
