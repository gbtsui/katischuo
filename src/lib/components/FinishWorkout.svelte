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

	let completeSets = $derived(
		setArray.filter((set) => set.completed)
	);

	let canSubmit = $derived(
		setArray.length > 0 && completeSets.length > 0
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
				startTime: TrackWorkoutState.workoutStartTime?.toISOString() ?? new Date().toISOString(),
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

	const handleModalOpen = () => {
		if (setArray.length) modalOpen = true;
	};
</script>

<div class=" max-w-1/2">
	<button
		class="p-[2rem] text-2xl my-[1rem] {!setArray.length ? 'bg-stone-900 cursor-not-allowed' : 'bg-emerald-700 cursor-pointer'}"
		onclick={handleModalOpen}><!--onclick={saveWorkout}>-->
		Finish Workout
	</button>
</div>

{#if modalOpen}
	<div
		class="absolute w-[100vw] h-[100vh] bg-stone-800/30 top-0 left-0 z-[10] flex justify-center align-center items-center overflow-hidden">
		<!--modal part-->
		<div
			class="relative w-[70vw] h-[80vh] bg-stone-700 flex flex-col text-center items-center mt-[5vh] justify-between p-[5rem]"
			transition:fly={{y: "30vh"}}>
			{#if loading}
				<div>loading...</div>
			{:else}
				<div class="text-2xl py-[1vh]">Are you sure you're done with your workout?</div>

				{#if incompleteSets.length}
					<div>
						<div>You still have the following incomplete sets:</div>
						<div class="flex flex-col justify-start h-[50vh] overflow-y-scroll 			[&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]">
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
				{:else}

					<div class="flex flex-col justify-start h-[50vh] overflow-y-scroll 			[&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]">
					{#each removeIncompleteSets() as setData (setData)}
						<div class="text-sm text-stone-300 flex gap-2 items-center">
							<span class="text-stone-500 text-xs w-4">{setData.order}</span>
							<span>{exerciseRecord[setData.exerciseId as string].exerciseName}</span>
							{#if setData.weight != null && setData.reps != null}
								<span>{setData.weight}{weightUnit} × {setData.reps}</span>
							{:else if setData.duration}
								<span>{setData.duration}s</span>
							{:else if setData.distance}
								<span>{setData.distance}km</span>
							{/if}
								<!--TODO: actually implement and inject distance preference here because its not in schema yet-->
							{#if setData.rpe}
								<span class="text-stone-400 text-xs">@ {setData.rpe} RPE</span>
							{/if}
							{#if setData.notes}
								<span class="text-stone-500 text-xs italic">{setData.notes}</span>
							{/if}
						</div>
					{/each}
					</div>

				{/if}
				<div class="flex flex-row gap-[2.5vw]">
					<button
						class="p-[0.5rem] text-xl bg-stone-600 transition-all {canSubmit ? 'cursor-pointer hover:p-[1rem]' : 'cursor-not-allowed text-stone-400'}"
						onclick={svbmitToSaveWorkout}>{canSubmit ? (incompleteSets.length ? "Save Anyways" : "Save") : "Can't save with no completed sets." }</button>
					<button class="p-[0.5rem] text-xl bg-red-600 cursor-pointer hover:p-[1rem] transition-all"
									onclick={() => modalOpen = false}>Nah, take me back
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!--Gustavus Adolphus gå fram, libera, impera
Acerbus et ingens gå fram, libera, impera
Augusta par angusta-->