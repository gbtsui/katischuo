import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { trackedWeightDataPoint } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({locals}) => {
	if (!locals.session?.userId) {
		return error(401, { message: 'thou art NOT SIGNED IN!!! i shall smite you with my HTTP error 401 inshallah' });
	}

	//might take a request of "how many days to look back" but for now just return EVERYTHING

	const result = await db.select().from(trackedWeightDataPoint).where(eq(trackedWeightDataPoint.userId, locals.session.userId))

	return json({success: true, records: result})
}