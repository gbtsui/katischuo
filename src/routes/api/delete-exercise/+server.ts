import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { exercise, } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({locals, request}) => {
	if (!locals.session?.userId) {
		return error(401, {message: 'unauthorized you silly'})
	}

	const result = await request.json()
	const exerciseId = result.exerciseId

	if (!exerciseId) {
		return error(400, {message: "no exerciseId provided!"})
	}

	await db.delete(exercise).where(eq(exerciseId, exercise.id))

	return json({success: true})
}