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

	function groupSequentialSets(sets: Array<Partial<InsertSet>>): Array<ExerciseGroup> {
		return sets.reduce((acc, set) => {
			const last = acc[acc.length - 1];

			if (last?.exerciseId === set.exerciseId) {
				last.sets.push(set);
			} else {
				acc.push({ exercise: exerciseRecord[set.exerciseId!]!, sets: [set] });
			}

			return acc;
		}, [] as Array<ExerciseGroup>);

		//ughh make a function to fetch a list of exercises at the beginning and then convert it into a keyvalue pair
		//
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

			{#each exerciseWithSetsArray as exerciseData (exerciseData)}
				<Exercise exercise={exerciseData.exercise} sets={exerciseData.sets} />
			{/each} <!--horrible and gross and disgusting and refactor this later-->

			<AddExercise exercises={data.exercises} confirmAddExercise={(exercise) => {
				const newSet: InsertSet = {
					exerciseId: exercise.id,
					order: setArray.length + 1,
				}
				setArray.push(newSet);
			}}/>
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
