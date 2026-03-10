import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
	id: uuid('id').primaryKey(),
	name: text("name").notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	password: text('password'),
	image: text('image'),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const accountTable = pgTable('accounts_table', {
	id: uuid('id').primaryKey(),
	userId: text("user_id").references(() => usersTable.id, {onDelete: "cascade"})

})

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

