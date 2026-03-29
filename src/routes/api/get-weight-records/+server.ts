import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { trackedWeightDataPoint} from '$lib/db/schema';
import { and, asc, desc, eq, gt, gte, lt, lte } from 'drizzle-orm';

export const GET: RequestHandler = async ({locals, url}) => {
	if (!locals.session?.userId) {
		return error(401, { message: 'thou art NOT SIGNED IN!!! i shall smite you with my HTTP error 401 inshallah' });
	}

	const dateParams = parseDateParams(url)
	const paginationParams = parsePaginationParams(url)
	const result = await getDbWeightRecordsByDateRange(locals.session.userId, dateParams, paginationParams)


	//might take a request of "how many days to look back" but for now just return EVERYTHING

	//const result = await db.select().from(trackedWeightDataPoint).where(eq(trackedWeightDataPoint.userId, locals.session.userId))
	return json({success: true, records: result})
}

async function getDbWeightRecordsByDateRange(
	userId: string,
	params: DateParams,
	{limit, offset, order}: PaginationParams
) {
	const orderFn = order === "desc" ? desc : asc; //ascerton pixi the iiird
	//const baseQuery = db.select().from(trackedWeightDataPoint).orderBy(trackedWeightDataPoint.createdAt);

	let query = db
		.select()
		.from(trackedWeightDataPoint)
		.orderBy(orderFn(trackedWeightDataPoint.createdAt))
		.$dynamic();

	const conditions = [eq(trackedWeightDataPoint.userId, userId)] //therefore ONLY search for right userId

	if (params) {
		if ('on' in params) {
			const startOfDay = new Date(params.on); startOfDay.setHours(0, 0, 0, 0);
			const endOfDay   = new Date(params.on); endOfDay.setHours(23, 59, 59, 999);
			conditions.push(gte(trackedWeightDataPoint.createdAt, startOfDay));
			conditions.push(lte(trackedWeightDataPoint.createdAt, endOfDay));
		} else {
			if (params.before) conditions.push(lt(trackedWeightDataPoint.createdAt, params.before));
			if (params.after)  conditions.push(gt(trackedWeightDataPoint.createdAt, params.after));
		}
	}

	query = query.where(and(...conditions));

	if (limit !== undefined) query = query.limit(limit);
	if (offset !== undefined) query = query.offset(offset);

	return query;
}

type DateParams = { before?: Date; after?: Date } | { on: Date } | undefined;
type PaginationParams = { limit?: number; offset?: number; order: 'asc' | 'desc' };


function parseDateParams(url: URL): DateParams {
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


function parsePaginationParams(url: URL): PaginationParams {
	const limitRaw  = url.searchParams.get('limit');
	const offsetRaw = url.searchParams.get('offset');
	const orderRaw  = url.searchParams.get('order');

	let limit: number | undefined;
	let offset: number | undefined;

	if (limitRaw !== null) {
		limit = parseInt(limitRaw, 10);
		if (isNaN(limit) || limit < 1) error(400, 'Invalid "limit": must be a positive integer');
	}

	if (offsetRaw !== null) {
		offset = parseInt(offsetRaw, 10);
		if (isNaN(offset) || offset < 0) error(400, 'Invalid "offset": must be a non-negative integer');
	}

	const order = orderRaw === 'desc' ? 'desc' : 'asc';

	return { limit, offset, order };
}

/*
I see the spark in your eyes
No one can deny
I don't care if no one else believes
If you believe then we gonna make it
Wake up now and shed your skin
We pin up the dream, you can share your tears

It's never too late, we will make it
Never too late, it's not enough, keep going
I know we'll make it

You ask me what do I wanna say to you
Come a little closer, little closer
Ask me what do I?
I wish I... I wish I...

Tonight, I won't hide, even barely breathing
I'm going nowhere for you to reaching
Even though we're burning alive, alive, alive
My beating heart is bigger than the distance we have, distance we have

Blind while the morning we wake up
Sober while we're chasing in our dream
We all know nothing is meant to be
So for once, let our heart win
Let our heart win !!!(the heart is deceitful above all things do not listen)!!!

Tonight, I won't hide, even barely breathing
I'm going nowhere for you to reaching
Even though we're burning alive, alive, alive
My beating heart is bigger than the distance we have, distance we have

Just show me, show me what you want me seeing
Just tell me, tell me what you want me hearing
You had my heart
So you can break it, break it
(Right now!)

Just show me, show me what you want me seeing
Just tell me, tell me what you want me hearing
Just show me, show me what you want me seeing
You had it all
So you can break it, just break it
 */