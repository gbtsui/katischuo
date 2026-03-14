import { relations } from "drizzle-orm/relations";
import { usersTable, accountsTable, sessionsTable, user, account, session } from "./schema";

export const accountsTableRelations = relations(accountsTable, ({one}) => ({
	usersTable: one(usersTable, {
		fields: [accountsTable.userId],
		references: [usersTable.id]
	}),
}));

export const usersTableRelations = relations(usersTable, ({many}) => ({
	accountsTables: many(accountsTable),
	sessionsTables: many(sessionsTable),
}));

export const sessionsTableRelations = relations(sessionsTable, ({one}) => ({
	usersTable: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));