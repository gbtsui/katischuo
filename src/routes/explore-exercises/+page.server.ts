import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/track/$types';
import { exercise, exerciseCategoryEnum, muscleGroupEnum, strengthExerciseEquipmentEnum } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({params}) => {

	return {
		exerciseCategories: exerciseCategoryEnum.enumValues,
		muscleGroups: muscleGroupEnum.enumValues,
		equipment: strengthExerciseEquipmentEnum.enumValues,
	}
}

