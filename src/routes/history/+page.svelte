<script lang="ts">
	//let {data} = $props()
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { WorkoutWithExercises, SelectUserPreferences } from '$lib/types';

	let data: null | { allWorkouts: WorkoutWithExercises[], userPrefs: SelectUserPreferences } = $state(null);
	let loading = $derived(data === null);
	let workouts: WorkoutWithExercises[] = $derived(
		data?.allWorkouts.toSorted((a, b) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		) ?? []
	);
	onMount(async () => {
		const res = await fetch(resolve('/api/get-workout-history'));
		console.log('wir zogen in das Feld (der Frontend)');
		const resObj = await res.json();
		//add err handling later
		if (!resObj.success) console.error(resObj);
		data = resObj.data;
	});
</script>

<div class="flex items-center w-[100vw] h-[100vh] flex-col align-center justify-start overflow-hidden text-stone-50 bg-stone-900 ">
	<div class="text-2xl h-[10vh] mt-[5vh]">Workout History</div>

	<div class="w-[80vw] h-[80vh] gap-[5vw] flex flex-row ">
		<!--history section-->
		<div class="w-[37.5vw] bg-stone-800">
			<div class="p-[1rem]">
				{#if loading}
					<div>Loading your workouts...</div>
				{:else}
					{#if workouts.length === 0}
						<div>Looks like you haven't tracked any workouts yet!</div>
					{/if}
					{#each workouts as workout (workout)}
						<div>
							<div>{workout.name}</div>
							<div>{workout.createdAt}</div>
							<div>
								<!--{Object.keys(workout)}-->
								{#each workout.exercises as exercise (exercise)}
									{exercise.exercise.exerciseName}
									{#each exercise.sets as set (set)}
										{set.order} - {set.weight}{data.userPrefs.weightUnit} x {set.reps} {set.rpe && `@ ${set.rpe}RPE`}
										<!--ugh add the logic here that checks what kind of exercise was actually tracked...-->
									{/each}

									<!--actually? calculate what kind of focus this was (up to 2)-->
								{/each}
							</div>
						</div>
					{/each}
				{/if}
			</div>

		</div>

		<!--in-focus section-->
		<div class="w-[37.5vw] bg-stone-800">
			<div>add like, in-focus analysis of history and record here! incorporate stats eventually?</div>
			<div>una matina mi son svegliato, o bella ciao bella ciao bella ciao ciao :speaking_head:</div>
		</div>
	</div>

</div>