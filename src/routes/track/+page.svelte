<script lang="ts">
	import { onMount } from 'svelte';
	import type { SelectExercise, InsertSet, TrackingSet } from '$lib/types';
	import Exercise from '$lib/components/Exercise.svelte';
	import type {PageData} from "./$types";
	import AddExercise from '$lib/components/AddExercise.svelte';
	import FinishWorkout from '$lib/components/FinishWorkout.svelte';
	import { TrackWorkoutState } from '$lib/store/state.svelte';

	let { data }: {data: PageData} = $props();
	let loading = $state(true);
	//let templateName = $state('Empty Workout');
	let workoutNameSelected = $state(false);
	//let setArray: Array<Partial<TrackingSet> > = $state([]);
	let now = $state(Date.now());

	let {templateName, setArray, workoutStartTime} = $derived(TrackWorkoutState);

	let timeElapsed = $derived(workoutStartTime ? now - workoutStartTime.getTime() : 0);
	let timeElapsedMinutes = $derived(Math.max(0, Math.floor(timeElapsed / 1000 / 60)));
	let timeElapsedSeconds = $derived(Math.max(0, Math.floor((timeElapsed / 1000) % 60)));
	let formattedTime = $derived(`${String(timeElapsedMinutes).padStart(2, '0')}:${String(timeElapsedSeconds).padStart(2, '0')}`);

	onMount(() => {
		loading = false;
		TrackWorkoutState.workoutStartTime = new Date();

		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);

		return () => clearInterval(interval);
	});

	//let workoutStartTime = $state(new Date())

	type ExerciseGroup = {
		//exerciseId: string;
		exercise: SelectExercise;
		sets: Array<Partial<TrackingSet>>;
	}

	//the full moon is rising :speaking_head:
	//type TrackingSet = InsertSet & { completed?: boolean }

	const exerciseRecord: Record<string, SelectExercise> = Object.fromEntries(data.exercises.map(exercise => [exercise.id, exercise]));


	function insertSetAtOrder(newSet: Partial<TrackingSet>, targetOrder: number) {
		const clampedOrder = Math.max(1, Math.min(targetOrder, TrackWorkoutState.setArray.length + 1));

		const shifted = TrackWorkoutState.setArray.map(s =>
			s.order! >= clampedOrder ? { ...s, order: s.order! + 1 } : s
		);
		shifted.splice(clampedOrder - 1, 0, { ...newSet, order: clampedOrder });
		TrackWorkoutState.setArray = [...shifted];
	}

	function updateSet(order: number, field: keyof TrackingSet, value: number | string | boolean) {
		const idx = TrackWorkoutState.setArray.findIndex(s => s.order === order);
		if (idx !== -1) {
			TrackWorkoutState.setArray = TrackWorkoutState.setArray.map((s, i) =>
				i === idx ? { ...s, [field]: value } : s
			);
		}
	}
	// ten thousand years apart...

	function deleteSetAtOrder(targetOrder: number) {
		TrackWorkoutState.setArray = TrackWorkoutState.setArray
			.filter(s => s.order !== targetOrder)
			.map(s => s.order! > targetOrder ? { ...s, order: s.order! - 1 } : s);
	}

	function groupSequentialSets(sets: Array<Partial<InsertSet>>): Array<ExerciseGroup> {
		const sorted = [...sets].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
		return sorted.reduce((acc, set) => {
			const last = acc[acc.length - 1];
			if (last?.exercise.id === set.exerciseId) {
				last.sets.push(set);
			} else {
				acc.push({ exercise: exerciseRecord[set.exerciseId!]!, sets: [set] });
			}
			return acc;
		}, [] as Array<ExerciseGroup>);
	}

	let exerciseWithSetsArray: Array<ExerciseGroup> = $derived(
		groupSequentialSets(setArray)
	);

	//Nietszche was right, God is dead and this code killed Him
	//but mashallah Christ resurrected after 3 days and trod down sin and my bad code underfoot! He is risen indeed!
	/*
	onMount(() => {
		loading = false;
		console.log(data.exercises);
		TrackWorkoutState.workoutStartTime = new Date();
	});

	$effect(() => {
		console.log(data.user_preferences)
	})

	 */

</script>


{#if !loading}
	<div class="w-[100vw] min-h-[100vh] flex bg-stone-900 text-stone-50 items-center justify-center align-center flex-col overflow-x-hidden">
		<div class="w-[70vw] min-h-[50vh] bg-stone-800 border border-stone-700 flex flex-col justify-center align-center items-center">
			<div class="w-[60vw] mx-[5vw] mt-[5vh] flex flex-col bg-stone-800 px-[2.5vw] py-[2.5vh] text-3xl"
					 class:selected={workoutNameSelected}>
				<input class="focus:outline-none focus:border-none bg-stone-700 p-[0.5rem]" placeholder="workout name" bind:value={templateName}
							 onfocusin={() => workoutNameSelected = true} onfocusout={() => workoutNameSelected = false} />
				<div>{formattedTime}</div>
			</div>

			{#each exerciseWithSetsArray as exerciseData, i (exerciseData.exercise.id + '-' + i)}
				<Exercise
					exercise={exerciseData.exercise}
					sets={exerciseData.sets}
					updateSet={updateSet}
					weightUnit={data.user_preferences.weightUnit}
					insertSetAtOrder={insertSetAtOrder}
					deleteSetAtOrder={deleteSetAtOrder}
				/>
			{/each}

			<AddExercise exercises={data.exercises} confirmAddExercise={(exercise) => {
				const newSet: Partial<TrackingSet> = {
					exerciseId: exercise.id,
					weight: 0,
					reps: 0,
					rpe: null,
					notes: "",
					duration: 0,
					completed: false
				}
				insertSetAtOrder(newSet, setArray.length+1)
			}}/>


			<FinishWorkout setArray={setArray} exerciseRecord={exerciseRecord} weightUnit={data.user_preferences.weightUnit}/>
		</div>
	</div>

{:else}
	<div>
		loading...
	</div>
{/if}

<style>
    .selected {
        border-width: 1rem;
        border: var(--color-stone-700)
    }
</style>

<!--wo men jin sheng zhu ding shi cang sang-->
<!--ku zhe lai yao xiao zhe zou guo ya-->
