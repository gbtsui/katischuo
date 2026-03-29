import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { set, workout, exercise } from '$lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { Calculate1RMBrzycki, Calculate1RMEpley } from '$lib/funcs/1rm';
import type { InsertSet } from '$lib/db/schema';
import type { OneRepMax } from '$lib/types';

const SUPPORTED_EQUIPMENT = ['machine', 'cable', 'barbell', 'dumbbell'] as const;
type SupportedEquipment = typeof SUPPORTED_EQUIPMENT[number];

type ExerciseRow = {
	set: InsertSet;
	equipment: string | null;
	exerciseId: string;
	exerciseName: string;
};

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.session?.userId) {
		return error(401, {
			message: 'thou art NOT SIGNED IN!!! i shall smite you with my HTTP error 401 inshallah'
		});
	}

	const { userId } = locals.session;
	const searchAll = parseSearchAll(url);

	if (searchAll) {
		const rows = await db
			.select({
				set,
				equipment: exercise.equipment,
				exerciseId: exercise.id,
				exerciseName: exercise.exerciseName,
			})
			.from(set)
			.innerJoin(workout, eq(set.workoutId, workout.id))
			.innerJoin(exercise, eq(set.exerciseId, exercise.id))
			.where(eq(workout.userId, userId));

		const unsupported = [...new Set(
			rows
				.filter(r => !isSupportedEquipment(r.equipment))
				.map(r => r.equipment ?? 'unknown')
		)];

		if (unsupported.length === rows.length) {
			return error(400, {
				message: `1RM can only be calculated for machine, cable, barbell, and dumbbell exercises.`
			});
		}

		const supportedRows = rows.filter(r => isSupportedEquipment(r.equipment));

		const setToWorkoutId = Object.fromEntries(
			rows.map(r => [r.set.id, r.set.workoutId])
		);

		return json({
			success: true,
			exercises: extractExercises(rows),
			oneRepMaxes: calculate1RMs(supportedRows.map((r) => r.set), setToWorkoutId),
		});
	}

	const ids = parseExerciseIds(url);
	if (!ids.length) return error(400, { message: 'No exerciseIds provided.' });

	const rows = await db
		.select({
			set,
			equipment: exercise.equipment,
			exerciseId: exercise.id,
			exerciseName: exercise.exerciseName,
		})
		.from(set)
		.innerJoin(workout, eq(set.workoutId, workout.id))
		.innerJoin(exercise, eq(set.exerciseId, exercise.id))
		.where(and(inArray(set.exerciseId, ids), eq(workout.userId, userId)));

	const unsupportedIds = new Set(
		rows
			.filter(r => !isSupportedEquipment(r.equipment))
			.map(r => r.set.exerciseId)
	);

	const supportedSets = rows
		.filter(r => isSupportedEquipment(r.equipment))
		.map(r => r.set);

	const setToWorkoutId = Object.fromEntries(
		rows.map(r => [r.set.id, r.set.workoutId])
	);


	return json({
		success: true,
		exercises: extractExercises(rows),
		oneRepMaxes: calculate1RMs(supportedSets, setToWorkoutId),
		warnings: unsupportedIds.size
			? [`1RM cannot be calculated for exercise IDs: ${[...unsupportedIds].join(', ')}`]
			: []
	});
};

function isSupportedEquipment(equipment: string | null): equipment is SupportedEquipment {
	return SUPPORTED_EQUIPMENT.includes(equipment as SupportedEquipment);
}

function extractExercises(rows: ExerciseRow[]): Record<string, { name: string; equipment: string | null }> {
	return rows.reduce(
		(acc, r) => {
			if (!acc[r.exerciseId]) {
				acc[r.exerciseId] = { name: r.exerciseName, equipment: r.equipment };
			}
			return acc;
		},
		{} as Record<string, { name: string; equipment: string | null }>
	);
}
function calculate1RMs(sets: InsertSet[], setToWorkoutId: Record<string, string>): Record<string, OneRepMax> {
	return sets.reduce(
		(acc, s) => {
			const epley = Calculate1RMEpley(
				parseFloat(s.weight as string),
				parseFloat(s.reps as string)
			);
			const brzycki = Calculate1RMBrzycki(
				parseFloat(s.weight as string),
				parseFloat(s.reps as string)
			);
			const average = (epley + brzycki) * 0.5;

			if (!acc[s.exerciseId] || average > (acc[s.exerciseId].epley + acc[s.exerciseId].brzycki) / 2) {
				acc[s.exerciseId] = {
					epley,
					brzycki,
					bestSet: s,
					workoutId: setToWorkoutId[s.id as string],
				};
			}

			return acc;
		},
		{} as Record<string, OneRepMax>
	);
}
function parseExerciseIds(url: URL): string[] {
	const raw = url.searchParams.get('exerciseId');
	if (!raw) return [];
	return raw.split(',').slice(0, 20);
}

function parseSearchAll(url: URL): boolean {
	return url.searchParams.get('all') === 'true';
}

/*
驸马爷近前看端详上写着
秦香莲她三十二岁
状告当朝驸马郎
欺君王 藐皇上
悔婚男儿招东床
杀妻灭子良心丧
逼死寒妻在庙堂
将状纸押至了爷的大堂上
咬定了牙关你为哪桩？
*/