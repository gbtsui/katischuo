import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { exercise, } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({locals, request}) => {
	if (!locals.session?.userId) {
		return error(401, {message: 'unauthorized you silly'})
	}

	const result = await request.json()
	const exerciseId = result.exerciseId

	if (!exerciseId) {
		return error(400, {message: "no exerciseId provided!"})
	}

	await db.delete(exercise).where(and(eq(exerciseId, exercise.id), eq(exercise.createdByUserId, locals.session.userId)))

	return json({success: true})
}