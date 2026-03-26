import type { PageServerLoad } from "$./types"
import { db } from '$lib/server/db';
import { userPrefs, workout, set, exercise, type SelectExercise, type SelectSet } from '$lib/db/schema';
import { and, eq, or } from 'drizzle-orm';
import type { WorkoutWithSets } from "$lib/types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = locals.session

	if (!session?.userId) return null

	let user_preferences = await db
		.selectDistinct()
		.from(userPrefs)
		.where(eq(session.userId, userPrefs.userId))

	if (!user_preferences.length) {
		user_preferences = await db.insert(userPrefs).values({
			userId: session.userId,
			weightUnit: "lbs"
		})
			.returning()
		console.log("generated new user prefs")
	}

	const allExercises = await db
		.select()
		.from(exercise)
		.where(or(
			eq(exercise.isCustom, false),
			and(eq(exercise.isCustom, true), eq(exercise.createdByUserId, session.userId))
		))

	const exerciseRecord: Record<string, SelectExercise> = Object.fromEntries(data.exercises.map(exercise => [exercise.id, exercise]));

	const allWorkouts = await getWorkoutsWithSets(session.userId)

	return { allWorkouts, userPrefs: user_preferences[0] }
}

async function getWorkoutsWithSets(userId: string): Promise<WorkoutWithSets[]> {
	const rows = await db
		.select()
		.from(workout)
		.where(eq(workout.userId, userId))
		.leftJoin(set, eq(set.workoutId, workout.id))
		.orderBy(workout.startTime, set.order)

	// Collapse the flat join rows into nested WorkoutWithSets objects
	const workoutMap = new Map<string, WorkoutWithSets>()

	for (const row of rows) {
		if (!workoutMap.has(row.workout.id)) {
			workoutMap.set(row.workout.id, { ...row.workout, sets: [] as SelectSet[]} as WorkoutWithSets)
		}

		if (row.set) {
			workoutMap.get(row.workout.id)!.sets.push(row.set)
		}
	}

	return Array.from(workoutMap.values())
}

//TODO: iactually return it probperly and inject exercise data into it as well ughaghauh im so tired but i need to do 8 hours tomorrow
// (signed at 11pm 25 march 2026)