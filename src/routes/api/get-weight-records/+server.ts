import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { trackedWeightDataPoint} from '$lib/db/schema';
import { and, eq, gt, gte, lt, lte } from 'drizzle-orm';

export const GET: RequestHandler = async ({locals, url}) => {
	if (!locals.session?.userId) {
		return error(401, { message: 'thou art NOT SIGNED IN!!! i shall smite you with my HTTP error 401 inshallah' });
	}

	const dateParams = parseDateParams(url)
	const result = getDbWeightRecordsByDateRange(locals.session.userId, dateParams)


	//might take a request of "how many days to look back" but for now just return EVERYTHING

	//const result = await db.select().from(trackedWeightDataPoint).where(eq(trackedWeightDataPoint.userId, locals.session.userId))

	return json({success: true, records: result})
}

async function getDbWeightRecordsByDateRange(
	userId: string,
	params: { before?: Date; after?: Date } | { on: Date } | undefined
) {
	const baseQuery = db.select().from(trackedWeightDataPoint).orderBy(trackedWeightDataPoint.createdAt);

	if (!params) {
		return baseQuery.where(eq(trackedWeightDataPoint.userId, userId));
	}

	if (Object.hasOwn(params, 'before') || Object.hasOwn(params, 'after')) {
		const { before, after } = params as { before?: Date; after?: Date };
		const conditions = [
			eq(trackedWeightDataPoint.userId, userId),
			before ? lt(trackedWeightDataPoint.createdAt, before) : undefined,
			after  ? gt(trackedWeightDataPoint.createdAt, after)  : undefined,
		].filter(Boolean);
		return baseQuery.where(and(...conditions));
	}

	// on: Date
	const { on } = params as { on: Date };
	const startOfDay = new Date(on); startOfDay.setHours(0, 0, 0, 0);
	const endOfDay   = new Date(on); endOfDay.setHours(23, 59, 59, 999);
	return baseQuery.where(and(
		eq(trackedWeightDataPoint.userId, userId),
		gte(trackedWeightDataPoint.createdAt, startOfDay),
		lte(trackedWeightDataPoint.createdAt, endOfDay),
	));
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

/*
Tonight, I won't hide, even barely breathing
I'm going nowhere for you to reaching
Even though we're burning alive, alive, alive
My beating heart is bigger than the distance we have, distance we have
 */