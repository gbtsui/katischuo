<script lang="ts">
	import { onMount } from 'svelte';
	import type { SelectExercise, InsertSet } from '$lib/types';
	import Exercise from '$lib/components/Exercise.svelte';
	import type {PageData} from "./$types";
	import AddExercise from '$lib/components/AddExercise.svelte';

	let { data }: {data: PageData} = $props();
	let loading = $state(true);
	let templateName = $state('Empty Workout');
	let workoutNameSelected = $state(false);
	let setArray: Array<Partial<InsertSet> > = $state([]);

	type ExerciseGroup = {
		//exerciseId: string;
		exercise: SelectExercise;
		sets: Array<Partial<InsertSet>>;
	}

	const exerciseRecord: Record<string, SelectExercise> = Object.fromEntries(data.exercises.map(exercise => [exercise.id, exercise]));

	function insertSetAtOrder(newSet: Partial<InsertSet>, targetOrder: number) {
		const clampedOrder = Math.max(1, Math.min(targetOrder, setArray.length + 1));

		setArray = setArray.map(s =>
			s.order! >= clampedOrder
				? { ...s, order: s.order! + 1 }
				: s
		);

		const setWithOrder: Partial<InsertSet> = { ...newSet, order: clampedOrder };

		setArray.splice(clampedOrder - 1, 0, setWithOrder);

		//trigger svelte react
		setArray = [...setArray];
	}

	function deleteSetAtOrder(targetOrder: number) {
		setArray = setArray.filter(s => s.order !== targetOrder);
		setArray = setArray.map(s =>
			s.order! >= targetOrder
			? { ...s, order: s.order! - 1 }
				: s
		)

		setArray = [...setArray];
	}

	function groupSequentialSets(sets: Array<Partial<InsertSet>>): Array<ExerciseGroup> {
		const sorted = [...sets].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
		return sorted.reduce((acc, set) => {
			const last = acc[acc.length - 1];
			if (last?.exercise.id === set.exerciseId) {
				last.sets.push(set);
			} else {
				acc.push({ exercise: exerciseRecord[set.exerciseId!]!, sets: [set] });
			}
			return acc;
		}, [] as Array<ExerciseGroup>);
	}

	let exerciseWithSetsArray: Array<ExerciseGroup> = $derived(
		groupSequentialSets(setArray)
	);

	//Nietszche was right, God is dead and this code killed Him
	//but mashallah Christ resurrected after 3 days and trod down sin and my bad code underfoot! He is risen indeed!
	onMount(() => {
		loading = false;
		console.log(data.exercises);
	});

	$effect(() => {
		console.log(data.user_preferences)
	})
</script>


{#if !loading}
	<div class="w-[100vw] min-h-[100vh] flex bg-stone-900 text-stone-50 items-center justify-center ">
		<div class="w-[70vw] min-h-[50vh] bg-stone-800 border border-stone-700 flex flex-col">
			<div class="w-[60vw] mx-[5vw] mt-[5vh] flex flex-col bg-stone-800 px-[2.5vw] py-[2.5vh] text-3xl"
					 class:selected={workoutNameSelected}>
				<input class="focus:outline-none focus:border-none" placeholder="workout name" bind:value={templateName}
							 onfocusin={() => workoutNameSelected = true} onfocusout={() => workoutNameSelected = false} />
				{#if workoutNameSelected}
					selected
				{/if}
			</div>

			{#each exerciseWithSetsArray as exerciseData, i (exerciseData.exercise.id + '-' + i)}
				<Exercise
					exercise={exerciseData.exercise}
					sets={exerciseData.sets}
					updateSet={(order, field, value) => {
      const idx = setArray.findIndex(s => s.order === order);
      if (idx !== -1) {
        setArray[idx] = { ...setArray[idx], [field]: value };
      }
    }}
					weightUnit={data.user_preferences.weightUnit}
					insertSetAtOrder={insertSetAtOrder}
					deleteSetAtOrder={deleteSetAtOrder}
				/>
			{/each}

			<AddExercise exercises={data.exercises} confirmAddExercise={(exercise) => {
				const newSet: Partial<InsertSet> = {
					exerciseId: exercise.id,
					weight: 0,
					reps: 0,
					rpe: null,
					notes: "",
					duration: 0
				}
				insertSetAtOrder(newSet, setArray.length+1)
			}}/>
		</div>


		<div>
			<div>Save </div>
		</div>
	</div>

{:else}
	<div>
		loading...
	</div>
{/if}

<style>
    .selected {
        border-width: 1rem;
        border: var(--color-stone-700)
    }
</style>

<!--wo men jin sheng zhu ding shi cang sang-->
<!--ku zhe lai yao xiao zhe zou guo ya-->
