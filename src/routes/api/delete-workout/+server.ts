import {db} from '$lib/server/db';
import {workout} from '$lib/db/schema';
import {json} from "@sveltejs/kit"
import type {RequestHandler} from '@sveltejs/kit';
import {error} from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({request, locals}) => {
	if (!locals.session?.userId) {
		return error(401, {message: 'unauthorized you silly'})
	}

	const result = await request.json()
	const workoutId = result.workoutId

	if (!workoutId) {
		return error(400, {message: "no workoutId provided!"})
	}

	await db.delete(workout).where(eq(workoutId, workout.id))

	return json({success: true})
}