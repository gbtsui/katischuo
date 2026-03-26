import { error, json, type RequestHandler } from '@sveltejs/kit';
import { exercise, type SelectExercise, set, userPrefs, workout } from '$lib/db/schema';
import type { SetWithExercise, WorkoutWithExercises } from '$lib/types';
import { db } from '$lib/server/db';
import { and, eq, or } from 'drizzle-orm';

//lmao i just pasted the code into a +server.ts and screwed around a bit that's how easy it was :broken_heart:
export const GET: RequestHandler = async ({locals}) => {
	console.log("request for Get Workout History has been requested!!!! beep boop beep boop working now...")
	const session = locals.session;
	if (!session?.userId) error(401, 'unauthorized you silly billy');
	//implement API key later?

	let user_preferences = await db
		.selectDistinct()
		.from(userPrefs)
		.where(eq(session.userId, userPrefs.userId));

	if (!user_preferences.length) {
		user_preferences = await db
			.insert(userPrefs)
			.values({
				userId: session.userId,
				weightUnit: 'lbs'
			})
			.returning();
		console.log('generated new user prefs');
	}

	const allExercises = await db
		.select()
		.from(exercise)
		.where(
			or(
				eq(exercise.isCustom, false),
				and(eq(exercise.isCustom, true), eq(exercise.createdByUserId, session.userId))
			)
		);

	const exerciseRecord: Record<string, SelectExercise> = Object.fromEntries(
		allExercises.map(ex => [ex.id, ex])
	);

	const allWorkouts = await getWorkoutsWithSets(session.userId, exerciseRecord);

	const result = { allWorkouts, userPrefs: user_preferences[0] };

	console.log("beep boop beep boop... result has been packaged and is about to be returned!")
	return json({ success: true, data: result });
}


async function getWorkoutsWithSets(userId: string, exerciseRecord: Record<string, SelectExercise>): Promise<WorkoutWithExercises[]> {
	const rows = await db
		.select()
		.from(workout)
		.where(eq(workout.userId, userId))
		.leftJoin(set, eq(set.workoutId, workout.id))
		.orderBy(workout.startTime, set.order);

	const workoutMap = new Map<string, Omit<WorkoutWithExercises, 'exercises'> & {
		exercises: Map<string, SetWithExercise>
	}>();
	for (const row of rows) {
		if (!workoutMap.has(row.workout.id)) {
			workoutMap.set(row.workout.id, { ...row.workout, exercises: new Map() });
		}

		const workoutEntry = workoutMap.get(row.workout.id)!;

		if (row.set) {
			const exerciseId = row.set.exerciseId;
			if (!workoutEntry.exercises.has(exerciseId)) {
				workoutEntry.exercises.set(exerciseId, {
					exercise: exerciseRecord[exerciseId],
					sets: [],
				});
			}
			workoutEntry.exercises.get(exerciseId)!.sets.push(row.set);
		}
	}

	return Array.from(workoutMap.values()).map(({ exercises, ...rest }) => ({
		...rest,
		exercises: Array.from(exercises.values()),
	}));
}