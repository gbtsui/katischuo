import { pgTable, boolean, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
	id: uuid('id').primaryKey(),
	name: text("name").notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text('image'),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const accountTable = pgTable('accounts_table', {
	id: uuid('id').primaryKey().notNull(),
	userId: uuid("user_id").references(() => usersTable.id, {onDelete: "cascade"}),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(), //so ts would be slack/google/github/credential
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	scope: text("scope"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	idToken: text("id_token"),
	password: text("password"), //null for everything except passwords!!!
})

export const sessionTable = pgTable('sessions_table', {
	id: uuid('id').primaryKey().notNull(),
	userId: uuid("user_id").references(() => usersTable.id),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	token: text("token").notNull().unique(),
})

export const verificationTable = pgTable('verifications_table', {
	id: uuid('id').primaryKey().notNull(),
	identifier: text("identifier"),
	value: text("value"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
})

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertAccount = typeof accountTable.$inferInsert;
export type SelectAccount = typeof accountTable.$inferSelect;

export type InsertSession = typeof sessionTable.$inferInsert;
export type SelectSession = typeof sessionTable.$inferSelect;

export type InsertVerification = typeof verificationTable.$inferInsert;
export type SelectVerification = typeof verificationTable.$inferSelect;


export * from './auth.schema';
