import { files } from "./schema";

export type File = typeof files.$inferSelect;
export type FileInsert = typeof files.$inferInsert;
