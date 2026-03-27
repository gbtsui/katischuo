<script>
	import { fly } from 'svelte/transition';

	let { exercise, onSelect, currentlySelectedExercise } = $props();

	console.log(exercise);

	let hovered = $state(false);

	//oh you lion from the north...
</script>

<div
	class="w-[45vw] h-[5rem] max-h-[5rem] min-h-[5rem] grow-0 px-[4.5vw] py-[2.5vh] mx-[0.5vw] flex flex-row content-between align-center items-center justify-between  transition-all cursor-pointer {hovered ? 'hoveredExerciseCard' : 'exerciseCard'} {(currentlySelectedExercise && currentlySelectedExercise.exerciseName === exercise.exerciseName) && 'selectedCard'}"
	onmouseover={() => hovered = true} onmouseleave="{() => hovered = false}" transition:fly={{duration: 670}}
	onclick={() => onSelect(exercise)}
>
	<div
		class="text-lg transition-all {hovered || (currentlySelectedExercise && currentlySelectedExercise.exerciseName === exercise.exerciseName) ? 'text-begin w-[20vw]' : 'w-[45vw] text-center'}"
		transition:fly>{exercise.exerciseName}</div>
	<div
		class="transition-all duration-300 overflow-hidden flex items-center justify-end {hovered || currentlySelectedExercise && currentlySelectedExercise.exerciseName === exercise.exerciseName ? 'w-[25vw] opacity-100' : 'w-0 opacity-0'}">
		{#if hovered || (currentlySelectedExercise && currentlySelectedExercise.exerciseName === exercise.exerciseName)}
			<div class="text-xs flex flex-col font-extralight">
				<div><span class="font-medium">Primary Muscles:</span> {exercise.primaryMuscle.map((element) => {
					return element.charAt(0).toUpperCase() + element.slice(1)
				}).join(", ")}</div>
				{#if exercise.secondaryMuscles}
					<div><span class="font-medium">Secondary Muscles:</span> {exercise.secondaryMuscles.map((element) => {
						return element.charAt(0).toUpperCase() + element.slice(1)
					}).map((element) => element.replace("_", " ")).join(", ")}</div>
				{/if}
				<div><span class="font-medium">Equipment:</span> {exercise.equipment}</div>
				<div><span class="font-medium">Category:</span> {exercise.category}</div>
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

    .selectedCard {
        background: var(--color-stone-50);
        color: var(--color-stone-900)
    }
</style>

<!--zeal shall fall upon an untaught people and fire shall consume the adversary (type errors)-->