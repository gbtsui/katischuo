import {db} from "$lib/server/db"
import { exercise, workout, user } from '$lib/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import type {PageServerLoad} from "./$types"
import { union } from 'drizzle-orm/pg-core';
import { authClient } from '$lib/auth-client';

export const actions = {
	createWorkout: async ({request, locals}) => {
		const formData = await request.formData()
	}
}

export const load: PageServerLoad = async ({params}) => {
	const {data: session} = await authClient.getSession()
	if (!session) return null
	const userData = (await db
		.selectDistinct()
		.from(user)
		.where(
			eq(user.id, session.user.id)
		))[0] //ts is probably pretty scuffed... idk what else to do tho

	//do i *really* need userData?

	return {
		exercises: await db
				.select()
				.from(exercise)
			.where(or(
				eq(exercise.isCustom, false),
				and(eq(exercise.isCustom, true), eq(exercise.createdByUserId, userData.id))
			)) //okay i think this should work - select both global exercises and user-created exercises that were created by user with same id
	}
}