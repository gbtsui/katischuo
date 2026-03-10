CREATE TABLE "accounts_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"scope" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"id_token" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "sessions_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"token" text NOT NULL,
	CONSTRAINT "sessions_table_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identifier" text,
	"value" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts_table" ADD CONSTRAINT "accounts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_table" ADD CONSTRAINT "sessions_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;