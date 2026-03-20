<script lang="ts">
	import type { SelectExercise, InsertSet } from '$lib/types';
	import { weightUnitEnum } from '$lib/types';
	import { fly } from 'svelte/transition';

	type WeightUnit = typeof weightUnitEnum.enumValues[number];

	let showToolTip = $state(false);

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

<link rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&icon_names=help" />
<div class="min-h-[20vh] w-[65vw] mx-[2.5vw] flex flex-col border border-stone-700 bg-stone-900 text-stone-50">
	<div class="mt-[2.5vh] ml-[2.5vw] text-xl">{exercise.exerciseName}</div>

	{#each sets as set (set.order)}
		<div class="flex flex-row justify-around items-center mt-[2.5vh]">
			<div class="text-stone-400 text-xl font-bold">
				{set.order}
			</div>
			<div class="flex flex-col">
				<div>weight ({weightUnit})</div>
				<input
					type="number"
					value={toDisplay(set.weight ?? 0)}
					oninput={(e) => {
						const val = e.currentTarget.valueAsNumber;
						updateSet(set.order!, 'weight', isNaN(val) ? null : toLbs(val));
					}}
					class="text-center p-[1rem] w-[10rem] bg-stone-200 text-stone-900"
				/>
			</div>

			<div class="flex flex-col">
				<div>reps</div>
				<input
					type="number"
					value={set.reps}
					oninput={(e) => {
						const val = e.currentTarget.valueAsNumber;
						updateSet(set.order!, 'reps', isNaN(val) ? null : val);
					}}
					class="text-center p-[1rem] w-[10rem] bg-stone-200 text-stone-900"
				/>

			</div>

			<div class="flex flex-col">
				<div class="flex flex-row items-center align-center">
					RPE
					<span class="material-symbols-outlined cursor-help" onmouseout={() => showToolTip = false}
								onmouseenter={() => showToolTip = true}>help</span>

					{#if showToolTip}
						<span class="text-xs absolute mb-[5vh] bg-stone-700 p-[1rem]" transition:fly>Rate of Perceived Exertion!</span>
					{/if}
				</div>
				<input
					type="number"
					value={set.rpe}
					oninput={(e) => {
						const val = e.currentTarget.valueAsNumber;
						updateSet(set.order!, 'rpe', isNaN(val) ? null : val)
					}}
					class="text-center p-[1rem] w-[10rem] bg-stone-200 text-stone-900"
				/>
			</div>
		</div>
	{/each}

	<button >+ Add Set</button>
</div>

<!--
fader vår, som är i himmelen
helgat varde ditt namn
tillkomme ditt rike
ske din vilja
såsom i himmelen så ock på jorden
giv oss idag vårt dagliga bröd
och förlåt oss våran skuld
-->