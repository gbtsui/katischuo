<script lang="ts">
	//import { SelectExercise, type InsertSet } from '$lib/server/db/schema';
	import type {SelectExercise, InsertSet} from "$lib/types";

	let {exercise, sets}: {exercise: SelectExercise, sets: Array<Partial<InsertSet>>} = $props()
</script>

<div class="h-[30vh] w-max bg-stone-900">
		<div>{exercise.name}</div>
</div>