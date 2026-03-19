import { pgTable, text, timestamp, uuid, numeric, pgEnum, boolean, integer } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const muscleGroupEnum = pgEnum("muscle_group", [
	"chest", "back", "shoulders", "biceps", "triceps",
	"legs", "glutes", "core", "cardio", "full_body", "other"
]);

export const exerciseCategoryEnum = pgEnum("exercise_category", [
	"strength", "cardio", "flexibility", "sport", "other"
]);

export const strengthExerciseEquipmentEnum = pgEnum("strength_exercise_type", [
	"bodyweight", "machine", "cable", "barbell", "dumbbell", "other"
])

export const weightUnitEnum = pgEnum("weight_unit", ["lbs", "kg"])

export const workout = pgTable("workout", {
	id: uuid("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	name: text("name"),
	notes: text("name")
})

export const exercise = pgTable("exercise", {
	id: uuid("id").primaryKey(),
	exerciseName: text("exercise_name").notNull(),
	category: exerciseCategoryEnum("category").notNull(),
	primaryMuscle: muscleGroupEnum("primary_muscle").array(),
	secondaryMuscles: muscleGroupEnum("secondary_muscles").array(),
	equipment: strengthExerciseEquipmentEnum("equipment"),
	isCustom: boolean("is_custom").default(false).notNull(),
	createdByUserId: text("created_by_user_id").references(() => user.id, {onDelete: "set null"}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const set = pgTable("set", {
	id: uuid("id").primaryKey(),
	workoutId: uuid("workout_id").notNull().references(() => workout.id, {onDelete: "cascade"}),
	exerciseId: uuid("exercise_id").notNull().references(() => exercise.id, {onDelete: "cascade"}),
	order: integer("order").notNull(), //be able to reconstruct the order of tracked sets because i forgot this was actually lowkenuinely important
	//type: strengthExerciseTypeEnum(), //can be bodyweight, machine, cable, barbell, dumbbell, other
	weight: numeric("weight"), //always always always in lbs and convert on UI (to 2 significant decimal places)
	reps: numeric("reps"),
	rpe: numeric("rpe"), //light work no reaction.
	notes: text("notes"),
	duration: numeric("duration") //nullable, will not be shown unless it's duration-based?
})

//removing cardioset so that i can just have a single set object

export const userPrefs = pgTable("user_prefs", {
	id: uuid("id").primaryKey(),
	userId: text("user_id").notNull().unique().references(() => user.id, {onDelete: "cascade"}),
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
