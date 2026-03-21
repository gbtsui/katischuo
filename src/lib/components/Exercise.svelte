<script lang="ts">
	import type { SelectExercise, InsertSet } from '$lib/types';
	import { weightUnitEnum } from '$lib/types';
	import ExerciseSet from '$lib/components/ExerciseSet.svelte';

	type WeightUnit = typeof weightUnitEnum.enumValues[number];

	let { exercise, sets, updateSet, weightUnit, insertSetAtOrder }: {
		exercise: SelectExercise;
		sets: Array<Partial<InsertSet>>;
		updateSet: (order: number, field: keyof InsertSet, value: number) => void;
		weightUnit: WeightUnit;
		insertSetAtOrder: (newSet: Partial<InsertSet>, targetOrder: number) => void;
	} = $props();

	const LBS_TO_KG = 0.453592;
	const KG_TO_LBS = 2.20462;

	console.log(sets)
	function handleNewSet() {
		const lastSet = sets[sets.length - 1];  // don't mutate with pop()
		const newSet: Partial<InsertSet> = {
			exerciseId: lastSet?.exerciseId,
			weight: 0,
			reps: 0,
			rpe: null,
			notes: "",
			duration: 0,
			type: "normal",
			distance: 0,
		};
		const targetOrder = (lastSet?.order ?? 0) + 1;
		insertSetAtOrder(newSet, targetOrder);
	}
</script>

<link rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&icon_names=help" />
<div class="min-h-[20vh] w-[65vw] mx-[2.5vw] flex flex-col border border-stone-700 bg-stone-900 text-stone-50">
	<div class="mt-[2.5vh] ml-[2.5vw] text-xl">{exercise.exerciseName}</div>

	{#each sets as set (set.order)}
		<ExerciseSet set={set} updateSet={updateSet} weightUnit={weightUnit}/>
	{/each}

	<button onclick={() => handleNewSet()}>+ Add Set</button>
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