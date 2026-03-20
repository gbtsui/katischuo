<script lang="ts">
	import type { SelectExercise, InsertSet } from "$lib/types";

	let { exercise, sets, updateSet }: {
		exercise: SelectExercise;
		sets: Array<Partial<InsertSet>>;
		updateSet: (order: number, field: keyof InsertSet, value: number) => void;
	} = $props();
</script>

<div class="h-[20vh] w-full bg-stone-900 text-stone-50">
	<div>{exercise.exerciseName}</div>

	{#each sets as set (set.order)}
		<div class="flex flex-row">
			<div class="flex flex-col">
				<div>weight</div>
				<input
					type="number"
					value={set.weight}
					oninput={() => updateSet((set.order!), 'weight', e.currentTarget.valueAsNumber)}
				/>
			</div>

			<div class="flex flex-col">
				<div>reps</div>
				<input
					type="number"
					value={set.reps}
					oninput={() => updateSet((set.order!), 'reps', e.currentTarget.valueAsNumber)}
				/>
			</div>
		</div>
	{/each}
</div>