<script>
	import { fly } from 'svelte/transition';

	let { exercise, onSelect } = $props();

	console.log(exercise);

	let hovered = $state(false);

	//oh you lion from the north...
</script>

<div
	class="w-[45vw] h-[10vh] px-[4.5vw] py-[2.5vh] mx-[0.5vw] flex flex-row content-between align-center items-center justify-between  transition-all cursor-pointer {hovered ? 'hoveredExerciseCard' : 'exerciseCard'}"
	onmouseover={() => hovered = true} onmouseleave="{() => hovered = false}" transition:fly={{duration: 670}}
	onclick={onSelect(exercise)}
>
	<div class="text-lg transition-all {hovered ? 'text-begin w-[20vw]' : 'w-[45vw] text-center'}"
			 transition:fly>{exercise.exerciseName}</div>
	<div
		class="transition-all duration-300 overflow-hidden flex items-center justify-end {hovered ? 'w-[25vw] opacity-100' : 'w-0 opacity-0'}">
		{#if hovered}
			<div class="text-sm flex flex-col">
				<div>Primary Muscles: {exercise.primaryMuscle.map((element) => {
					return element.charAt(0).toUpperCase() + element.slice(1)
				}).join(", ")}</div>
				{#if exercise.secondaryMuscles}
					<div>Secondary Muscles: {exercise.secondaryMuscles.map((element) => {
						return element.charAt(0).toUpperCase() + element.slice(1)
					}).map((element) => element.replace("_", " ")).join(", ")}</div>
				{/if}
				<div>Equipment: {exercise.equipment}</div>
				<div>Category: {exercise.category}</div>
			</div>
		{/if}
	</div>
</div>


<style>
    .hoveredExerciseCard {
        /*background: var(--color-stone-50);
        color: var(--color-stone-900);*/
        background: var(--color-stone-800);
        color: var(--color-stone-50)
    }

    .exerciseCard {
        background: var(--color-stone-800);
        color: var(--color-stone-50)
    }
</style>