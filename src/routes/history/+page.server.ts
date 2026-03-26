import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	userPrefs,
	workout,
	set,
	exercise,
	type SelectExercise,
} from '$lib/db/schema';
import { and, eq, or } from 'drizzle-orm';
import type { SetWithExercise, WorkoutWithExercises} from '$lib/types';

//at some point i gotta convert ts to an api endpoint blehhhhh
export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session?.userId) return null;

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

	return { allWorkouts, userPrefs: user_preferences[0] };
};
//i did it yay

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