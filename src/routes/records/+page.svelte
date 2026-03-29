<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let oneRepMaxes: Record<string, { epley: number, brzycki: number }> | null = $state(null);

	const updateOneRepMaxes = async () => {
		const res = await fetch(resolve('/api/get-exercise-1rm?all=true'));
		if (!res.ok) console.error(res);
		const resJson = await res.json();
		console.log(res);
		oneRepMaxes = resJson.oneRepMaxes
		//if (!res.ok) console.error(res)
		//else oneRepMaxes = res.oneRepMaxes
	};

	onMount(async () => {
		await updateOneRepMaxes();
	});

	//todo: also implement volume + max reps in a set
</script>

<div>
	{JSON.stringify(oneRepMaxes)}
</div>