import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const pg = postgres({ ssl: "require" });

export const db = drizzle(pg, { schema });
