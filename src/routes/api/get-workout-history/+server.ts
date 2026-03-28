// noinspection LanguageDetectionInspection

import { error, json, type RequestHandler } from '@sveltejs/kit';
import {
	exercise,
	type SelectExercise,
	//type SelectSet,
	//type SelectWorkout,
	set,
	userPrefs,
	workout
} from '$lib/db/schema';
import type { SetWithExercise, WorkoutJoinRow, WorkoutWithExercises } from '$lib/types';
import { db } from '$lib/server/db';
import { and, eq, lt, gt, gte, lte, or } from 'drizzle-orm';

export const GET: RequestHandler = async ({locals, url}) => {
	const session = locals.session;
	if (!session?.userId) error(401, 'unauthorized you silly billy');

	//implement API key later?

	/*
	can be on{} OR before{} AND/OR after{}
	 */
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

	//const requestData = (await request.json()).then(res => res.data)
	const dateParams = parseDateParams(url);

	//const allWorkouts = await getWorkoutsWithSets(session.userId, exerciseRecord);
	const allWorkouts = await getWorkoutsWithSets(
		await getDbWorkoutsByDateRange(session.userId, dateParams),
		exerciseRecord
	)

	const result = { allWorkouts, userPrefs: user_preferences[0] };

	console.log("beep boop beep boop... result has been packaged and is about to be returned!")
	return json({ success: true, data: result });
}

function parseDateParams(url: URL): { before?: Date; after?: Date } | { on: Date } | undefined {
	const on     = url.searchParams.get('on');
	const before = url.searchParams.get('before');
	const after  = url.searchParams.get('after');

	if (on) {
		const onDate = new Date(on);
		if (isNaN(onDate.getTime())) error(400, 'Invalid "on" date');
		return { on: onDate };
	}

	if (before || after) {
		const result: { before?: Date; after?: Date } = {};
		if (before) {
			result.before = new Date(before);
			if (isNaN(result.before.getTime())) error(400, 'Invalid "before" date');
		}
		if (after) {
			result.after = new Date(after);
			if (isNaN(result.after.getTime())) error(400, 'Invalid "after" date');
		}
		return result;
	}

	return undefined;
}

async function getDbWorkoutsByDateRange(userId: string, params: {before?: Date, after?: Date} | {on: Date} | undefined): Promise<WorkoutJoinRow[]> {
	const baseQuery = db.select().from(workout)
		.leftJoin(set, eq(set.workoutId, workout.id))
		.orderBy(workout.startTime, set.order);

	if (!params) {
		return baseQuery.where(eq(workout.userId, userId))
	}

	if (Object.hasOwn(params, "before") || Object.hasOwn(params, "after")) {
		const { before, after } = params as { before?: Date, after?: Date };
		const conditions = [
			eq(workout.userId, userId),
			before ? lt(workout.startTime, before) : undefined,
			after  ? gt(workout.startTime, after)  : undefined,
		].filter(Boolean);
		return baseQuery.where(and(...conditions));
	} else if (Object.hasOwn(params, "on")) {
		const { on } = params as { on: Date };
		const startOfDay = new Date(on); startOfDay.setHours(0, 0, 0, 0);
		const endOfDay   = new Date(on); endOfDay.setHours(23, 59, 59, 999);
		return baseQuery.where(and(
			eq(workout.userId, userId),
			gte(workout.startTime, startOfDay),
			lte(workout.startTime, endOfDay),
		));
	}
	//if (!params) {
	else {
		throw new Error("hi why is this code in an unreachable state")
		//return baseQuery.where(eq(workout.userId, userId));
	}
}

async function getWorkoutsWithSets(
	rows: WorkoutJoinRow[],
	exerciseRecord: Record<string, SelectExercise>
): Promise<WorkoutWithExercises[]> {
	/*
	const rows = await db
		.select()
		.from(workout)
		.where(eq(workout.userId, userId))
		.leftJoin(set, eq(set.workoutId, workout.id))
		.orderBy(workout.startTime, set.order);

	 */

	//type safety hell
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
/*
Bortom Svea rikes gränser
Hörs ett kall från ovan jord
Följer kristendomens regler
Offensivens man, soldat i Jesu namn

För fränder fosterland och konung
Genom elden skall han gå
Opåverkad inför ödet
Möter döden för sin religiösa tro

In i striden genom ett kulregn, Herrens vilja ske
In i striden går han på led

Tills han vitögat ser, karolinen marscherar fram
Lade sitt liv i Guds hand för sin konung och fosterland
Tills han vitögat ser, karolinen marscherar fram

Moral och religion förenar
Mod och brödraskap består
Att smäda Guds namn, möta döden
Offensivens man, soldat i Jesu namn

In i striden genom ett kulregn, Herrens vilja ske
In i striden går han på led

Tills han vitögat ser, karolinen marscherar fram
Lade sitt liv i Guds hand för sin konung och fosterland
Tills han vitögat ser, karolinen marscherar fram
 */