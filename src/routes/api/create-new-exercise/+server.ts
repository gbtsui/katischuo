import { error, json, type RequestHandler } from '@sveltejs/kit';
import {
	exercise,
	exerciseCategoryEnum,
	type InsertExercise,
	muscleGroupEnum,
	strengthExerciseEquipmentEnum
} from '$lib/db/schema';
import { db } from '$lib/server/db';
import {eq, and, or} from 'drizzle-orm';

type ExerciseCategory = (typeof exerciseCategoryEnum.enumValues)[number];
type MuscleGroup = (typeof muscleGroupEnum.enumValues)[number];
type Equipment = (typeof strengthExerciseEquipmentEnum.enumValues)[number];

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.userId) {
		return error(401, { message: 'Not signed in.' });
	}

	const data = await request.formData();

	const exerciseName = data.get('exercise_name');
	const category = data.get('category');
	const primaryMuscle = data.getAll('primary_muscle');
	const secondaryMuscles = data.getAll('secondary_muscles');
	const equipment = data.get('equipment');

	if (!exerciseName || typeof exerciseName !== 'string') {
		return error(400, { message: 'Exercise name is required.' });
	}
	if (!category || !exerciseCategoryEnum.enumValues.includes(category as ExerciseCategory)) {
		return error(400, { message: 'A valid category is required.' });
	}
	if (!primaryMuscle.length) {
		return error(400, { message: 'At least one primary muscle is required.' });
	}

	const validatedPrimary = primaryMuscle.filter((m): m is MuscleGroup =>
		muscleGroupEnum.enumValues.includes(m as MuscleGroup)
	);
	const validatedSecondary = secondaryMuscles.filter((m): m is MuscleGroup =>
		muscleGroupEnum.enumValues.includes(m as MuscleGroup)
	);
	const validatedEquipment =
		equipment && strengthExerciseEquipmentEnum.enumValues.includes(equipment as Equipment)
			? (equipment as Equipment)
			: null;

	const existingExercises = await db
		.select()
		.from(exercise)
		.where(
			or(
				and(
					eq(exercise.exerciseName, exerciseName),
					eq(locals.session.userId, exercise.createdByUserId)
				),
				and(
					eq(exercise.exerciseName, exerciseName),
					eq(exercise.isCustom, false)
				)
			)
		);

	if (existingExercises.length)
		return error(409, 'already exists an exercise with that name, bucko');

	const newExercise: InsertExercise = {
		exerciseName,
		category: category as ExerciseCategory,
		primaryMuscle: validatedPrimary,
		secondaryMuscles: validatedSecondary,
		equipment: validatedEquipment,
		isCustom: true,
		createdByUserId: locals.session.userId
	};

	await db.insert(exercise).values(newExercise);

	return json({ success: true }, { status: 201 });
};
//the color of this world gradually eroded