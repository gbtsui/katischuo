<script lang="ts">
	//let {data} = $props()
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { WorkoutWithExercises, SelectUserPreferences } from '$lib/types';
	import HistoricalWorkoutListItem from '$lib/components/HistoricalWorkoutListItem.svelte';

	let data: null | { allWorkouts: WorkoutWithExercises[], userPrefs: SelectUserPreferences } = $state(null);
	let loading = $derived(data === null);
	let workouts: WorkoutWithExercises[] = $derived(
		data?.allWorkouts.toSorted((a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		) ?? []
	);

	let selectedWorkout: WorkoutWithExercises | null = $state(null);

	onMount(async () => {
		const res = await fetch(resolve('/api/get-workout-history'));
		console.log('wir zogen in das Feld (der Frontend)');
		const resObj = await res.json();
		//add err handling later
		if (!resObj.success) console.error(resObj);
		data = resObj.data;
	});

</script>

<div
	class="flex items-center w-[100vw] h-[100vh] flex-col align-center justify-start overflow-hidden text-stone-50 bg-stone-900 ">
	<div class="text-2xl h-[10vh] mt-[5vh]">Workout History</div>

	<div class="w-[80vw] h-[80vh] gap-[5vw] flex flex-row ">
		<!--history section-->
		<div class="w-[37.5vw] bg-stone-800">
			<div class="p-[1rem] gap-[1rem]">
				{#if loading || !data?.userPrefs}
					<div>Loading your workouts...</div>
				{:else}
					{#if workouts.length === 0}
						<div>Looks like you haven't tracked any workouts yet!</div>
					{/if}
					{#each workouts as workout (workout)}
						<HistoricalWorkoutListItem workout={workout} setSelectedWorkout={(workout: WorkoutWithExercises) => selectedWorkout = workout} selectedWorkout={selectedWorkout} />
					{/each}
				{/if}
			</div>

		</div>

		<!--in-focus section-->
		<div class="w-[37.5vw] bg-stone-800">
			{selectedWorkout}
			{#if selectedWorkout}
				<div class="text-sm">Workout in Focus</div>
				<div class="text-xl">{selectedWorkout?.name}</div>
			{/if}
		</div>
	</div>

</div>
