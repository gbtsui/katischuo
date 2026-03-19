import { pgTable, text, timestamp, uuid, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const weightUnitEnum = pgEnum("weight_unit", ["lbs", "kg"])

export const workout = pgTable("workout", {
	id: uuid("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
})

export const set = pgTable("set", {
	id: uuid("id").primaryKey(),
	workoutId: uuid("workout_id").notNull().references(() => workout.id, {onDelete: "cascade"}),
	exerciseName: text("exercise_name"),
	type: text("type"), //can be bodyweight, machine, cable, barbell, dumbbell, other
	weight: numeric("weight"), //default in lbs! convert to kg if needed!!!
})

export const cardioSet = pgTable("cardio", {
	id: uuid("id").primaryKey(),
	workoutId: uuid("workout_id").notNull().references(() => workout.id, {onDelete: "cascade"}),
	exerciseName: text("exercise_name"),

})

export const userPrefs = pgTable("user_prefs", {
	id: uuid("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
	createdAt: timestamp("created_at").defaultNow().notNull(), //do i even need ts
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	weightUnit: weightUnitEnum()
})

export const trackedWeightDataPoint = pgTable("tracked_weight_data_point", {
	id: uuid("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	weight: numeric("weight"),
})

export * from './auth.schema.ts';
