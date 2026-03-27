<script lang="ts">
	//let {data} = $props()
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import {fly} from 'svelte/transition';
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
	<div class="text-2xl h-[10vh] mt-[5vh]" transition:fly>Workout History</div>
	<a href={resolve("/dashboard")} class="absolute top-[2.5vh] left-0 w-[15vw] h-[3.5rem] bg-stone-700 text-center justify-center flex items-center hover:w-[17.5vw] hover:text-xl cursor-pointer transition-all ">Dashboard</a>

	<div class="w-[80vw] h-[80vh] gap-[5vw] flex flex-row ">
		<!--history section-->
		<div class="w-[37.5vw] bg-stone-800 overflow-y-scroll 			[&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]"  transition:fly={{delay: 67*2}}>
			<div class="flex flex-col p-[1rem] gap-[0.5rem]">
				{#if loading || !data?.userPrefs}
					<div>Loading your workouts...</div>
				{:else}
					{#if workouts.length === 0}
						<div>Looks like you haven't tracked any workouts yet!</div>
					{/if}
					{#each workouts as workout, index (workout)}
						<HistoricalWorkoutListItem workout={workout}
																			 setSelectedWorkout={(workout: WorkoutWithExercises) => selectedWorkout = workout}
																			 selectedWorkout={selectedWorkout} index={index}/>
					{/each}
				{/if}
			</div>

		</div>

		<!--in-focus section-->
		<div class="w-[37.5vw] bg-stone-800 overflow-y-scroll [&::-webkit-scrollbar]:w-[1vw]
[&::-webkit-scrollbar-track]:bg-stone-500
[&::-webkit-scrollbar-thumb]:bg-stone-800
[&::-webkit-scrollbar]:mx-[1vw]" transition:fly={{delay: 67}}>
			<div class="p-[2rem]">
				{#if selectedWorkout}
					{@const
						duration = Math.round((new Date(selectedWorkout.endTime).getTime() - new Date(selectedWorkout.startTime).getTime()) / 60000)}
					{@const totalVolume = selectedWorkout.exercises.reduce((acc, ex) =>
							acc + ex.sets.reduce((s, set) =>
								s + (set.weight && set.reps ? parseFloat(set.weight) * parseFloat(set.reps) : 0), 0
							), 0
					)}
					<!--TODO: make a thing to query bodyweight from this day and as a heuristic use it to calculate volume-->
					{@const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
					{@const startDate = new Date(selectedWorkout.startTime)}
					{@const dateStr = startDate.toLocaleDateString('en-CA', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
					{@const timeStr = startDate.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}

					<!--header-->
					<div class="mb-4">
						<div class="text-xs text-stone-400 mb-1">Workout in Focus</div>
						<div class="text-2xl font-semibold">{selectedWorkout?.name ?? 'Untitled Workout'}</div>
						<div class="text-sm text-stone-400 mt-1">{dateStr} - {timeStr}</div>
					</div>

					<!--stats-->
					<div class="grid grid-cols-3 gap-2 mb-6">
						<div class="bg-stone-700 p-3 flex flex-col">
							<span class="text-xs text-stone-400 mb-1">Duration</span>
							<span class="text-lg font-medium">{duration}m</span>
						</div>
						<div class="bg-stone-700 p-3 flex flex-col">
							<span class="text-xs text-stone-400 mb-1">Total sets</span>
							<span class="text-lg font-medium">{totalSets}</span>
						</div>
						<div class="bg-stone-700 p-3 flex flex-col">
							<span class="text-xs text-stone-400 mb-1">Volume</span>
							<span class="text-lg font-medium">{totalVolume.toLocaleString()}{data.userPrefs.weightUnit}</span>
						</div>
					</div>

					<!--notes (uagh i need to actually implement notetaking :sob:) -->
					{#if selectedWorkout.notes}
						<div class="mb-4 text-sm text-stone-300 italic border-l-2 border-stone-500 pl-3">
							{selectedWorkout.notes}
						</div>
					{/if}

					<!--exercises-->
					<div class="flex flex-col gap-4">
						{#each selectedWorkout.exercises as exercise (exercise)}
							{@const exerciseVolume = exercise.sets.reduce((acc, set) =>
								acc + (set.weight && set.reps ? parseFloat(set.weight) * parseFloat(set.reps) : 0), 0
							)}
							<div class="bg-stone-700 p-3">
								<div class="flex justify-between items-baseline mb-2">
									<div class="font-medium">{exercise.exercise.exerciseName}</div>
									<div class="text-xs text-stone-400">{exercise.sets.length} sets
										{#if exerciseVolume > 0}· {exerciseVolume.toLocaleString()}{data.userPrefs.weightUnit}{/if}
									</div>
								</div>
								<div class="flex flex-col gap-1">
									{#each exercise.sets as set (set)}
										<div class="text-sm text-stone-300 flex gap-2 items-center">
											<span class="text-stone-500 text-xs w-4">{set.order}</span>
											{#if set.type !== 'normal'}
												<span class="text-xs px-1 rounded bg-stone-600 text-stone-300">{set.type}</span>
											{/if}
											{#if set.weight && set.reps}
												<span>{set.weight}{data.userPrefs.weightUnit} × {set.reps}</span>
											{:else if set.duration}
												<span>{set.duration}s</span>
											{:else if set.distance}
												<!--TODO: actually implement and inject distance preference here because its not in schema yet-->
												<span>{set.distance}km</span>
											{/if}
											{#if set.rpe}
												<span class="text-stone-400 text-xs">@ {set.rpe} RPE</span>
											{/if}
											{#if set.notes}
												<span class="text-stone-500 text-xs italic">{set.notes}</span>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-stone-400">Select a workout to view details here...</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>

</style>