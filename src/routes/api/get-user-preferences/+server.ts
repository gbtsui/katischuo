import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userPrefs } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({locals}) => {
	if (!locals.session?.userId) return error(401, {message: "unauthorized pls sign in :)"})

	let [userPref] = await db.select().from(userPrefs).where(eq(userPrefs.userId, locals.session.userId))

	if (!userPref) userPref = (await db.insert(userPrefs).values({
		userId: locals.session.userId
	}).returning())[0]

	return json({success: true, userPref})
}