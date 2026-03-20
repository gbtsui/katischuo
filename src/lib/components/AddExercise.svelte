<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { SelectExercise } from '$lib/db/schema';
	import AddExerciseOption from '$lib/components/AddExerciseOption.svelte';

	let { exercises }: { exercises: SelectExercise[] } = $props();

	let searchBarContents = $state("")
	let filteredExercises = $derived(exercises.filter((element) => searchBarContents ? element.exerciseName.toLowerCase().includes(searchBarContents.toLowerCase()) : element))

	let modalOpen = $state(false);
	let selectedExercise: SelectExercise | null = $state(null)

	console.log(filteredExercises)

	function openModal() {
		modalOpen = true;
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
		<div class="relative w-[70vw] h-[80vh] bg-stone-700 flex flex-col text-center items-center mt-[5vh]" transition:fly={{y: "30vh"}}>
			<div class="text-2xl py-[1vh]">Add Exercise</div>
			<input bind:value={searchBarContents} placeholder="Search for an exercise..." class="text-xl bg-stone-50 text-stone-900 p-[1vh]"/>
			<div class="overflow-y-scroll overflow-x-hidden flex flex-col gap-[2.5vh] h-[50vh] w-[50vw] justify-center items-center mt-[5vh]
			[&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]
">
				{#each filteredExercises as exercise (exercise.id)}
					<AddExerciseOption exercise={exercise} onSelect={(ex) => selectedExercise = ex}/>
				{/each}
				{#if !exercises.length}
					huh. looks like there's no exercises in the db matching your search... maybe create one?
					{/if}
			</div>

			{#if selectedExercise !== null}
				{selectedExercise}
				{/if}
		</div>
	</div>
{/if}
