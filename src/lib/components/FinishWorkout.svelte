<script lang="ts">
	import type { SelectExercise, TrackingSet } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { TrackWorkoutState } from '$lib/store/state.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { setArray, exerciseRecord, weightUnit }: {
		setArray: Array<Partial<TrackingSet>>,
		exerciseRecord: Record<string, SelectExercise>,
		weightUnit: 'lbs' | 'kg'
	} = $props();
	let modalOpen = $state(false);

	let incompleteSets = $derived(
		setArray.filter((set) => !set.completed)
	);

	let loading = $state(false);

	$effect(() => console.log(setArray));

	const removeIncompleteSets = (): Array<Partial<TrackingSet>> => {
		let newSetArray = setArray.filter((set) => set.completed);
		newSetArray = newSetArray.map((set, index) => {
			if (set.order !== index + 1) return { ...set, order: index + 1 };
			return set;
		});

		return newSetArray;
	};

	const svbmitToSaveWorkout = async () => {
		loading = true;
		const res = await fetch('/api/track-workout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: TrackWorkoutState.templateName,
				startTime: TrackWorkoutState.workoutStartTime.toISOString(),
				endTime: new Date().toISOString(),
				sets: removeIncompleteSets()
			})
		});

		const data = await res.json();
		if (!data.success) {
			console.error('Failed to save workout', data);
			loading = false;
		} else {
			//setArray = []
			//ugh redirect i guess?
			await goto(resolve('/history'));
		}
	};
</script>

<div class=" max-w-1/2">
	<button
		class="p-[2rem] text-2xl my-[1rem] {!setArray.length ? 'bg-stone-900 cursor-not-allowed' : 'bg-emerald-700 cursor-pointer'}"
		onclick={() => modalOpen = true}><!--onclick={saveWorkout}>-->
		Finish Workout
	</button>
</div>

{#if modalOpen}
	<div
		class="absolute w-[100vw] h-[100vh] bg-stone-800/30 top-0 left-0 z-[10] flex justify-center align-center items-center overflow-hidden">
		<!--modal part-->
		<div class="relative w-[70vw] h-[80vh] bg-stone-700 flex flex-col text-center items-center mt-[5vh]"
				 transition:fly={{y: "30vh"}}>
			{#if loading}
				<div>loading...</div>
			{:else}
				<div class="text-2xl py-[1vh]">Are you sure you're done with your workout?</div>

				{#if incompleteSets.length}
					<div>
						<div>You still have the following incomplete sets:</div>
						<div>
							{#each incompleteSets as incompleteSet (incompleteSet)}
								<div>{incompleteSet.order}
									- {exerciseRecord[incompleteSet.exerciseId as string].exerciseName} {incompleteSet.weight}{weightUnit}
									<!--TODO: implement a thingy that can tell what kind of exercise it is and display accordingly-->
									x {incompleteSet.reps}</div>
							{/each}
						</div>
						<div>
							These sets will be discarded if you choose to save now!
						</div>
					</div>
				{/if}
				<div class="flex flex-row gap-[2.5vw]">
					<button class="p-[0.5rem] text-xl bg-stone-700"
									onclick={svbmitToSaveWorkout}>{incompleteSets.length ? "Save Anyways" : "Save" }</button>
					<button class="p-[0.5rem] text-xl bg-red-600" onclick={() => modalOpen = false}>Nah, take me back</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!--Gustavus Adolphus gå fram, libera, impera
Acerbus et ingens gå fram, libera, impera
Augusta par angusta-->