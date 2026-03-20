<script lang="ts">
	//import { SelectExercise, type InsertSet } from '$lib/server/db/schema';
	import type {SelectExercise, InsertSet} from "$lib/types";

	let {exercise, sets}: {exercise: SelectExercise, sets: Array<Partial<InsertSet>>} = $props()
</script>

<div class="h-[20vh] w-full bg-stone-900 text-stone-50">
		<div>{exercise.exerciseName}</div>

	{#each sets as set (set)}
		<div>{JSON.stringify(set)}</div>
	{/each}
</div>