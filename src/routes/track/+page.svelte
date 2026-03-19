<script lang="ts">
	import { onMount } from 'svelte';
	import type { InsertSet } from '$lib/types';
	import Exercise from '$lib/components/Exercise.svelte';
	import type {PageData} from "./$types";

	let { data }: {data: PageData} = $props();
	//actually die :broken_heart:
	let loading = $state(true);
	//let workoutNumber = $state(-1); //do i even need ts?
	let templateName = $state('Empty Workout');

	let workoutNameSelected = $state(false);

	let setArray: Array<Partial<InsertSet> > = $state([]);

	type ExerciseGroup = {
		exerciseId: string;
		sets: Array<Partial<InsertSet>>;
	}

	function groupSequentialSets(sets: Array<Partial<InsertSet>>): Array<ExerciseGroup> {
		return sets.reduce((acc, set) => {
			const last = acc[acc.length - 1];

			if (last?.exerciseId === set.exerciseId) {
				last.sets.push(set);
			} else {
				acc.push({ exerciseId: set.exerciseId!, sets: [set] });
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

			{#each exerciseWithSetsArray as exerciseData (exerciseData.exerciseId)}
				<Exercise key={exerciseData.exerciseId} exercise={exerciseData.exerciseId} sets={exerciseData.sets} />
			{/each}

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
