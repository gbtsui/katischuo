import type { PageServerLoad } from './$types';
import {
	exercise,
	exerciseCategoryEnum,
	type InsertExercise,
	muscleGroupEnum,
	strengthExerciseEquipmentEnum
} from '$lib/server/db/schema';
import type { Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async () => {
	return {
		exerciseCategories: exerciseCategoryEnum.enumValues,
		muscleGroups: muscleGroupEnum.enumValues,
		equipment: strengthExerciseEquipmentEnum.enumValues,
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const session = locals.session

		if (!session || !session.user) return fail(401, {message: "not signed in!!"})

		const exerciseName = data.get('exercise_name');
		const category = data.get('category');
		const primaryMuscle = data.getAll('primary_muscle');
		const secondaryMuscles = data.getAll('secondary_muscles');
		const equipment = data.get('equipment');

		if (!exerciseName || !category || !primaryMuscle.length) {
			return fail(400, { message: "missing required fields" });
		}

		const newExercise: InsertExercise = {
			id: randomUUID(),
			exerciseName: exerciseName as string,
			category: category as typeof exerciseCategoryEnum.enumValues[number],
			primaryMuscle: primaryMuscle as  typeof muscleGroupEnum.enumValues[number][],
			secondaryMuscles: secondaryMuscles as typeof muscleGroupEnum.enumValues[number][],
			equipment: equipment ? equipment as typeof strengthExerciseEquipmentEnum.enumValues[number] : null,
			isCustom: true,
			createdByUserId: session.user.id
		};

		await db.insert(exercise).values(newExercise);
	}
};