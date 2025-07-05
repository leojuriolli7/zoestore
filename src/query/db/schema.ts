import { pgTable, text, numeric, serial } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image_url: text("image_url").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export type DB_Product = InferSelectModel<typeof products>;
