<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { SelectUserPreferences, WorkoutWithExercises } from '$lib/types.js';

	let open = $state(false);
	let { workout, userPrefs }: { workout: WorkoutWithExercises, userPrefs: SelectUserPreferences | null } = $props();

	const openThingyImTooTiredToNameFunctionsProperly = () => {
		open = !open;
	};
</script>

<div class="flex flex-col gap-0 w-full">
	<div class="h-[3rem] p-[0.5rem] flex flex-row bg-stone-600 cursor-pointer select-none" onclick={openThingyImTooTiredToNameFunctionsProperly}>
		<div class="text-lg">
			{workout.name}
		</div>
	</div>
	{#if open}
		<div class="min-h-[2rem] bg-stone-700" transition:fly={{y: "-10vh"}}>
			{#each workout.exercises as exercise (exercise)}
				<div class="p-[0.5rem]">
					{exercise.exercise.exerciseName}
				</div>
				<div>
					{#each exercise.sets as set (set)}
						<div class="p-[0.5rem]">
							{set.order}
							<!--{set.type === "normal" ? "" : (set.type === "failure" ? (<span class="text-red-600">F</span>) : (set.type === "drop" ? <span class="text-blue-400">D</span> : <span class="text-orange-400">W</span>))}-->
							<!--stupid chud function-->
							- {set.weight}{userPrefs?.weightUnit ?? "lbs"} × {set.reps}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>