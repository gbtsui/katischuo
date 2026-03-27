import type { PageServerLoad } from './$types';
import {
	exerciseCategoryEnum,
	muscleGroupEnum,
	strengthExerciseEquipmentEnum
} from '$lib/db/schema';


export const load: PageServerLoad = async () => {
	return {
		exerciseCategories: exerciseCategoryEnum.enumValues,
		muscleGroups: muscleGroupEnum.enumValues,
		equipment: strengthExerciseEquipmentEnum.enumValues,
	};
};

/*
export const actions: Actions = {
	/*create: async ({ request, locals }) => {
		const data = await request.formData();
		const session = locals.session

		console.log(session)

		if (!session || !session.userId) return fail(401, {message: "not signed in!!"})

		const exerciseName = data.get('exercise_name');
		const category = data.get('category');
		const primaryMuscle = data.getAll('primary_muscle');
		const secondaryMuscles = data.getAll('secondary_muscles');
		const equipment = data.get('equipment');

		if (!exerciseName || !category || !primaryMuscle.length) {
			console.log(exerciseName);
			console.log(category);
			console.log(primaryMuscle)
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
			createdByUserId: session.userId
		};

		console.log(newExercise)

		await db.insert(exercise).values(newExercise);

		return {success: true}
	}
	//TODO: UAGHHHHHH REFACTOR THIS TO USE THE NEW API ROUTE!!!
};*/