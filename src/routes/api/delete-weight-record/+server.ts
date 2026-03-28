import { error, json, type RequestHandler } from '@sveltejs/kit';
import { trackedWeightDataPoint } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({locals, request}) => {
	if (!locals.session?.userId) return error(401, {message: "unauthorized. i'm running out of unauthorized jokes"})

	const result = await request.json()
	const recordId = result.id

	if (!recordId) return error(400, {message: "No id provided!!!"})

	try {
		await db.delete(trackedWeightDataPoint).where(and(eq(trackedWeightDataPoint.userId, locals.session.userId), eq(trackedWeightDataPoint.id, recordId)))
	} catch (err) {
		console.error(err)
		if (err instanceof Error) return error(500, {message: err.message})
		return error(500, {message: "Unknown error occurred :("})
	}

	return json({success: true})
}