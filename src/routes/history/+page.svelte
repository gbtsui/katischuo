<script lang="ts">
	//let {data} = $props()
	import {onMount} from 'svelte';
	import {resolve} from '$app/paths';
	import type { WorkoutWithExercises, SelectUserPreferences } from '$lib/types';

	let data: null | {allWorkouts: WorkoutWithExercises[], userPrefs: SelectUserPreferences} = null

	onMount(async () => {
		const res = await fetch(resolve("/api/get-workout-history"))
		console.log("clientside go go go!")
			const resObj = await res.json()
		if (!resObj.success) console.error(resObj)
		data = resObj.data
		console.log(data)
	})
</script>