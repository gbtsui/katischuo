import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { set, workout } from '$lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { Calculate1RMBrzycki, Calculate1RMEpley } from '$lib/funcs/1rm';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.session?.userId) {
		return error(401, {
			message: 'thou art NOT SIGNED IN!!! i shall smite you with my HTTP error 401 inshallah'
		});
	}

	//just accept a single exercise for now like i guess?
	//or, actually, search 10 at most

	const ids = parseExerciseId(url)
	if (!ids.length) return error(400, { message: "no exerciseIds provided!" })

	const sets = (await db
		.select({set})
		.from(set)
		.innerJoin(workout, eq(set.workoutId, workout.id))
		.where(
			and(
				inArray(set.exerciseId, ids),
				eq(workout.userId, locals.session.userId)
			)
		)).map((astaghfirullah) => astaghfirullah.set);
	const oneRepMaxes = sets.reduce((acc, s) => {
		const epley1RM = Calculate1RMEpley(parseFloat(s.weight as string), parseFloat(s.reps as string));
		const brzycki1RM = Calculate1RMBrzycki(parseFloat(s.weight as string), parseFloat(s.reps as string));

		const average1RM = (epley1RM + brzycki1RM) * 0.5;

		if (!acc[s.exerciseId] || average1RM > (acc[s.exerciseId].epley + acc[s.exerciseId].brzycki) / 2) {
			acc[s.exerciseId] = { epley: epley1RM, brzycki: brzycki1RM };
		}

		return acc;
	}, {} as Record<string, { epley: number, brzycki: number }>);

	return json({success: true, oneRepMaxes})
}

function parseExerciseId(url: URL) {
	const exerciseIdsRaw = url.searchParams.get('exerciseId');
	if (!exerciseIdsRaw) return [];

	return exerciseIdsRaw.split(',').slice(0, 20);
}