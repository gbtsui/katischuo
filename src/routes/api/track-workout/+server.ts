import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { workout, set } from '$lib/db/schema';
import type { InsertSet } from '$lib/db/schema';

//guhhh this has to be an API endpoint so that it can be accessible through both the sv frontend and other stuff

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = locals.session;

	if (!session?.userId) {
		error(401, 'unauthorized you silly billy');
	}

	//TODO: allow authoraization from API key
	//TODO: actually add and implement API keys.
	//should actually be pretty easy, just do a database search of API keys and lookup user based on that

	/*
	BRING IT BACK TO ME FROM NOW WE FACE IT
	IF WE ARE ALL SO SICK WHY CAN'T WE QUIT
	WE ARE THE DIRT WE LIVE LIKE A PSYCHOPATH
	LEAVE US ALONE CAUSE WE DON'T NEED YOUR POLITICS

	BRING IT BACK TO ME FROM NOW WE FACE IT
	IF WE ARE ALL SO SICK WHY CAN'T WE QUIT
	WE ARE THE DIRT WE LIVE LIKE A PSYCHOPATH
	LEAVE US ALONEEEEEEEEEEEE

	i see the spark in your eyes, no one can deny~

	i don't care if no one else believes, if you believe then we gonna make it
	wake up now and shed your skin we pin up the dream you can share your tears
	its never too late, we will make it, never too late
	it's not enough to keep going, i know we'll make it

	you ask me what do i wanna say to you?
	come a little closer, little closer
	ask me what do i?
	i wish i, i wish i...

	tonight i won't hide even barely breathing
	i'm going nowhere for you to reaching
	even though we're burning alive, alive, alive
	 */

	const body = await request.json();
	const { name, notes, startTime, endTime, sets } = body as {
		name?: string;
		notes?: string;
		startTime: string;
		endTime: string;
		sets: Array<Omit<InsertSet, 'id' | 'workoutId'>>;
	};

	if (!startTime || !endTime || !sets?.length) {
		error(400, `missing required fields: ${startTime? "" : "startTime"} ${endTime ? "" : "endTime"} ${sets ? "" : "sets"}`);
	}

	const result = await db.transaction(async (tx) => {
		const [newWorkout] = await tx
			.insert(workout)
			.values({
				userId: session.userId,
				name: name ?? null,
				notes: notes ?? null,
				startTime: new Date(startTime),
				endTime: new Date(endTime),
			})
			.returning();

		const newSets = await tx
			.insert(set)
			.values(
				sets.map((s) => ({
					...s,
					workoutId: newWorkout.id,
					weight: s.weight ?? null,
					reps: s.reps ?? null,
					rpe: s.rpe ?? null,
					duration: s.duration ?? null,
					distance: s.distance ?? null,
				}))
			)
			.returning();

		return { workout: newWorkout, sets: newSets };
	});

	return json({ success: true, data: result });
};