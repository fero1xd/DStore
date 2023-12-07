import { pgSchema, uuid, varchar } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("dstore");

export const files = mySchema.table("files", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  chunks: varchar("chunks", { length: 255 }).array(),
  contentType: varchar("contentType", { length: 255 }).notNull(),
});
