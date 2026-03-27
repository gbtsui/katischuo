import {json} from "@sveltejs/kit"
import { exercise } from '$lib/db/schema';
import { db } from '$lib/server/db';
import { and, eq, or } from 'drizzle-orm';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({locals}) => {
	const session = locals.session;
	if (!session?.userId) error(401, 'unauthorized you silly billy');

	const allExercises = await db
		.select()
		.from(exercise)
		.where(
			or(
				eq(exercise.isCustom, false),
				and(eq(exercise.isCustom, true), eq(exercise.createdByUserId, session.userId))
			)
		);

	console.log(allExercises)

	return json({success: true, data: allExercises})
}