<script lang="ts">
	import type { SelectExercise, TrackingSet } from '$lib/types';
	import { fly } from 'svelte/transition';

	let { setArray, exerciseRecord, weightUnit }: { setArray: Array<Partial<TrackingSet>>, exerciseRecord: Record<string, SelectExercise>, weightUnit: "lbs" | "kg" } = $props();
	let modalOpen = $state(false);

	let incompleteSets = $derived(
		setArray.filter((set) => !set.completed)
	);

	$effect(() => console.log(setArray))

	const removeIncompleteSets = (): Array<Partial<TrackingSet>> => {
		let newSetArray = setArray.filter((set) => set.completed)
		newSetArray = newSetArray.map((set, index) => {
			if (set.order !== index + 1) return {...set, order: index + 1}
			return set
		})

		return newSetArray
	}
</script>

<div class=" max-w-1/2">
	<button class="p-[2rem] text-2xl my-[1rem] {!setArray.length ? 'bg-stone-900 cursor-not-allowed' : 'bg-emerald-700 cursor-pointer'}" onclick={() => modalOpen = true}><!--onclick={saveWorkout}>-->
		Finish Workout
	</button>
</div>

{#if modalOpen}
	<div
		class="absolute w-[100vw] h-[100vh] bg-stone-800/30 top-0 left-0 z-[10] flex justify-center align-center items-center overflow-hidden">
		<!--modal part-->
		<div class="relative w-[70vw] h-[80vh] bg-stone-700 flex flex-col text-center items-center mt-[5vh]"
				 transition:fly={{y: "30vh"}}>
			<div class="text-2xl py-[1vh]">Are you sure you're done with your workout?</div>

			{#if incompleteSets}
				<div>
					<div>You still have the following incomplete sets:</div>
					<div>
						{#each incompleteSets as incompleteSet (incompleteSet)}
							<div>{incompleteSet.order} - {exerciseRecord[incompleteSet.exerciseId as string].exerciseName} {incompleteSet.weight}{weightUnit} x {incompleteSet.reps}</div>
						{/each}
					</div>
					<div>
						These sets will be discarded if you choose to save now!
					</div>

					<div>
						<button>Save Anyways</button>
						<button>Nah, take me back</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!--Gustavus Adolphus gå fram, libera, impera
Acerbus et ingens gå fram, libera, impera
Augusta par angusta-->