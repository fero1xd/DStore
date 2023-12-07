ALTER TABLE "dstore"."files" ALTER COLUMN "chunks" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "dstore"."files" ADD COLUMN "messageId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "dstore"."files" ADD CONSTRAINT "files_messageId_unique" UNIQUE("messageId");