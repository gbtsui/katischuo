<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { SelectExercise } from '$lib/db/schema';
	import AddExerciseOption from '$lib/components/AddExerciseOption.svelte';
	import CreateExerciseForm from '$lib/components/CreateExerciseForm.svelte';

	let { onExerciseCreated, confirmAddExercise }: {
		onExerciseCreated: () => void,
		confirmAddExercise: (exercise) => void
	} = $props();

	let searchBarContents = $state('');
	let exercises = $state<SelectExercise[]>([]);
	let filteredExercises = $derived(
		Array.isArray(exercises)
			? exercises.filter(el =>
				searchBarContents
					? el.exerciseName.toLowerCase().includes(searchBarContents.toLowerCase())
					: true
			)
			: []
	);
	let modalOpen = $state(false);
	let selectedExercise: SelectExercise | null = $state(null);

	const fetchExercises = async () => {
		exercises = await fetch('/api/exercises/')
			.then(res => res.json())
			.then(res => res.data);
		console.log(exercises)
		onExerciseCreated()
	};

	function openModal() {
		modalOpen = true;
		fetchExercises(); //refetch every time modal opens?
	}
</script>
<!--UNDETECTED UNEXPECTED WINGS OF GLORY TELL THEIR STORY AVIATION DEVIATION UNDETECTED STEALTH PERFECTED-->

<div class="flex items-center align-middle justify-center px-[5vw]">
	<!--button part-->
	<button onclick={() => openModal()}
					class="cursor-pointer justify-self-center align-middle text-2xl bg-stone-700 p-[2vh] hover:text-3xl hover:w-[50vw] min-w-[20vw] w-[20vw] transition-all">
		+ Add Exercise
	</button>
</div>


{#if modalOpen}
	<div
		class="absolute w-[100vw] h-[100vh] bg-stone-800/30 top-0 left-0 z-[10] flex justify-center align-center items-center overflow-hidden">
		<!--modal part-->
		<div class="relative w-[70vw] h-[80vh] bg-stone-700 flex flex-col text-center items-center mt-[5vh]"
				 transition:fly={{y: "30vh"}}>
			<div class="flex flex-row w-full px-[2.5rem] py-[1rem] justify-between">
				<div class="text-2xl py-[1vh]">Add Exercise</div>
				<button onclick={() => modalOpen = false} aria-label="Close" class="hover:text-lg text-md cursor-pointer transition-all">close</button>

			</div>

			<div class="flex flex-row w-full px-[2.5rem] py-[1rem] justify-around items-center ">
				<CreateExerciseForm onSuccess={fetchExercises} />
				<input bind:value={searchBarContents} placeholder="Search for an exercise..."
							 class="text-xl bg-stone-500 text-stone-900 p-[1vh] h-[2.5rem]" />
			</div>
			<div class="overflow-y-scroll overflow-x-hidden flex flex-col gap-[2.5vh] h-[50vh] w-[50vw] justify-center items-center mt-[2.5vh] mb-[2.5vh] py-[2.5vh]
			[&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]
">
				{#each filteredExercises as exercise (exercise.id)}
					<AddExerciseOption exercise={exercise} currentlySelectedExercise={selectedExercise}
														 onSelect={(ex) => selectedExercise = ex} />
				{/each}
				{#if !exercises.length}
					huh. looks like there's no exercises in the db matching your search... maybe create one?
				{/if}
			</div>

			<div
				class="py-[2.5vh] text-center align-center {selectedExercise !== null ? 'bg-stone-100 text-stone-900 w-[25vw] cursor-pointer' : 'w-[20vw] bg-stone-900 text-stone-400 cursor-not-allowed'}  flex items-center justify-center transition-all"
				onclick={() => {modalOpen = false; confirmAddExercise(selectedExercise);}}>
				add exercise
			</div>

		</div>
	</div>
{/if}
