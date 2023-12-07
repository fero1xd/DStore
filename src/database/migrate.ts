import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const pg = postgres({ ssl: "require" });

const main = async () => {
  const db = drizzle(pg);
  console.log("[+] Migration starting");
  await migrate(db, { migrationsFolder: "./drizzle" });

  pg.end();
};

main().then(() => console.log("[+] Migration ended"));
