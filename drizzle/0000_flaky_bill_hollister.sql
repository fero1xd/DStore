CREATE SCHEMA "dstore";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dstore"."files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
