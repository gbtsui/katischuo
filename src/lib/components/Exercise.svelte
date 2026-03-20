<script lang="ts">
	import type { SelectExercise, InsertSet } from "$lib/types";
	import { weightUnitEnum } from "$lib/types";

	type WeightUnit = typeof weightUnitEnum.enumValues[number];

	let { exercise, sets, updateSet, weightUnit }: {
		exercise: SelectExercise;
		sets: Array<Partial<InsertSet>>;
		updateSet: (order: number, field: keyof InsertSet, value: number) => void;
		weightUnit: WeightUnit;
	} = $props();

	const LBS_TO_KG = 0.453592;
	const KG_TO_LBS = 2.20462;

	// lbs (stored) to display unit
	function toDisplay(lbs: number): number {
		return weightUnit === 'kg' ? +(lbs * LBS_TO_KG).toFixed(2) : lbs;
	}

	// display unit to lbs (stored)
	function toLbs(displayVal: number): number {
		return weightUnit === 'kg' ? +(displayVal * KG_TO_LBS).toFixed(4) : displayVal;
	}
</script>

<div class="h-[20vh] w-full bg-stone-900 text-stone-50">
	<div>{exercise.exerciseName}</div>

	{#each sets as set (set.order)}
		<div class="flex flex-row">
			<div class="flex flex-col">
				<div>weight ({weightUnit})</div>
				<input
					type="number"
					value={toDisplay(set.weight ?? 0)}
					oninput={() => updateSet(set.order!, 'weight', toLbs(e.currentTarget.valueAsNumber))}
				/>
			</div>

			<div class="flex flex-col">
				<div>reps</div>
				<input
					type="number"
					value={set.reps}
					oninput={() => updateSet(set.order!, 'reps', e.currentTarget.valueAsNumber)}
				/>
			</div>
		</div>
	{/each}
</div>