import { eq } from "drizzle-orm";
import { db } from "./db";
import { File as FileType, FileInsert } from "./types";
import { files } from "./schema";

export const getFile = async (messageId: string): Promise<FileType | null> => {
  try {
    const file = await db.query.files.findFirst({
      where: eq(files.id, messageId),
    });

    return file ? file : null;
  } catch (err) {
    // console.error(err);
  }

  return null;
};

export const insertFile = async (file: FileInsert) => {
  try {
    const inserted = await db.insert(files).values(file).returning();

    return inserted[0];
  } catch (err) {
    console.error(err);
  }

  return null;
};
