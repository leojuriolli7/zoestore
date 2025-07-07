import "server-only";

export const appServerConfig = {
  db: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    adminKeyCookieName: "zoe_store__admin_key",
    adminKey: process.env.ADMIN_KEY!,
    cronSecret: process.env.CRON_SECRET!,
  },
};
