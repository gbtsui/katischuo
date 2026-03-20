import {db} from "$lib/server/db"
import { exercise, userPrefs } from '$lib/db/schema';
import { and, eq, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	createWorkout: async ({request, locals}) => {
		const formData = await request.formData()
		return { success: true } //guh
	}
}

export const load: PageServerLoad = async ({params, locals}) => {
	const session = locals.session
	console.log(session)
	if (!session?.userId) return null

	let user_preferences = await db
		.selectDistinct()
		.from(userPrefs)
		.where(eq(session.userId, userPrefs.userId))

	console.log(user_preferences)

	if (!user_preferences.length) {
		user_preferences = await db.insert(userPrefs).values({
			userId: session.userId,
			weightUnit: "lbs"
		})
			.returning()
	}
	console.log("generated new user prefs")
	console.log(user_preferences)

	return {
		exercises: await db
				.select()
				.from(exercise)
			.where(or(
				eq(exercise.isCustom, false),
				and(eq(exercise.isCustom, true), eq(exercise.createdByUserId, session.userId))
			)), //okay i think this should work - select both global exercises and user-created exercises that were created by user with same id,

		user_preferences: user_preferences[0]
	}
}