import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userPrefs } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({locals}) => {
	if (!locals.session?.userId) return error(401, {message: "unauthorized pls sign in :)"})

	const userPref = await db.select().from(userPrefs).where(eq(userPrefs.userId, locals.session.userId))

	return json({success: true, userPref})
}