<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';

	let {workout, setSelectedWorkout, selectedWorkout} = $props()

	function calculateHowManyDaysAgo(date: Date): string {
		const now = new Date();

		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		const diffMs = today.getTime() - target.getTime();
		const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "today";
		if (diffDays === 1) return "yesterday";
		if (diffDays > 1) return `${diffDays} days ago`;

		return `in ${Math.abs(diffDays)} days`;
	}

	function calculatePrimaryMuscleGroupsWorked(): string[] {
		const muscleCount = new SvelteMap<string, number>();

		for (const { exercise } of workout.exercises) {
			for (const muscle of exercise.primaryMuscle ?? []) {
				muscleCount.set(muscle, (muscleCount.get(muscle) ?? 0) + 1);
			}
		}

		return [...muscleCount.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 2)
			.map(([muscle]) => muscle);
	}

	function formatMuscle(muscle: string): string {
		return muscle.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}
</script>

<div class="flex flex-col w-[32.5vw] h-[4rem] hover:bg-stone-700 transition-all px-[0.5rem] cursor-pointer select-none {selectedWorkout?.id === workout.id ? 'bg-stone-300 text-stone-800' : ''}" onclick={() => setSelectedWorkout(workout)}>
	<div class="flex flex-row justify-between content-start">
		<div class="text-lg">{workout.name}</div>
		<div class="text-sm text-stone-400">{calculateHowManyDaysAgo(new Date(workout.startTime))}</div>
	</div>
	<div>
		<div class="text-md text-stone-400">
			{calculatePrimaryMuscleGroupsWorked().map(formatMuscle).join(' · ')}
		</div>
		<!--{Object.keys(workout)}-->

		<!--
		{#each workout.exercises as exercise (exercise)}
			{exercise.exercise.exerciseName}
			-->

			<!--
			{#each exercise.sets as set (set)}
				{set.order} - {set.weight}{userPrefs.weightUnit} x {set.reps} {set.rpe && `@ ${set.rpe}RPE`}
				ugh add the logic here that checks what kind of exercise was actually tracked...
			{/each}-->

			<!--actually? calculate what kind of focus this was (up to 2)-->
		<!--{/each}-->
	</div>
</div>