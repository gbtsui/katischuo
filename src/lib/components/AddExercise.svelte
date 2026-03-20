<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { SelectExercise } from '$lib/db/schema';

	let { exercises }: { exercises: SelectExercise } = $props();

	let modalOpen = $state(false);
	let searchBarContents = $state("")

	console.log(exercises)

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
		<div class="relative w-[70vw] h-[80vh] bg-stone-700 flex flex-col text-center items-center " transition:fly={{y: "30vh"}}>
			<div>Add Exercise</div>
			<div class="overflow-y-scroll">
				{#each exercises as exercise (exercise.id)}
					<div>{exercise.exerciseName}</div>
				{/each}
				{#if !exercises.length}
					huh. looks like there's no exercises in the db...
					{/if}
			</div>
		</div>
	</div>
{/if}