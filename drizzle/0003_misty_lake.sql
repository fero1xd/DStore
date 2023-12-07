ALTER TABLE "dstore"."files" DROP CONSTRAINT "files_messageId_unique";--> statement-breakpoint
ALTER TABLE "dstore"."files" DROP COLUMN IF EXISTS "messageId";