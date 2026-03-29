<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { OneRepMax } from '$lib/types';

	let oneRepMaxes: Record<string, OneRepMax>[] | null = $state(null);
	let maxVolumes: Record<string, number>[] | null = $state(null);
	let maxReps: Record<string, number> [] | null = $state(null);

	let page: '1rm' | 'volume' | 'reps' = $state('1rm');

	const updateOneRepMaxes = async () => {
		const res = await fetch(resolve('/api/get-exercise-1rm?all=true'));
		if (!res.ok) console.error(res);
		const resJson = await res.json();
		console.log(res);
		oneRepMaxes = resJson.oneRepMaxes;
		//if (!res.ok) console.error(res)
		//else oneRepMaxes = res.oneRepMaxes
	};

	const handleChangePage = (bleh: "1rm" | "volume" | "reps") => page=bleh

	onMount(async () => {
		await updateOneRepMaxes();
	});

	//todo: also implement volume + max reps in a set
</script>


<div
	class="flex items-center w-[100vw] h-[100vh] flex-col align-center justify-start overflow-hidden text-stone-50 bg-stone-900 ">
	<div class="text-2xl h-[10vh] mt-[5vh]" transition:fly>Records</div>
	<div class="w-[80vw] h-[80vh] gap-[5vw] flex flex-row ">
		<!--selecteth-->
		<div class="flex flex-col gap-0 bg-stone-800">
			<div class="flex flex-row justify-start">
				<button class="p-[1rem] {page !== '1rm' && 'bg-stone-900'}" onclick={() => handleChangePage("1rm")}>One Rep Max</button>
				<button class="p-[1rem] {page !== 'volume' && 'bg-stone-900'}" onclick={() => handleChangePage("volume")}>Volume</button>
				<button class="p-[1rem] {page !== 'reps' && 'bg-stone-900'}" onclick={() => handleChangePage("reps")}>Reps</button>

			</div>
			<div class="w-[37.5vw] h-full overflow-y-scroll 			[&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]" transition:fly={{delay: 67*2}}>
				<div class="m-[1rem] bg-stone-700">
					{#if page === "1rm"}
						{#if !oneRepMaxes?.length}
							<div class="p-[1rem]">No 1RM records found.
								<span class="text-sm">(Note: because of the nature of bodyweight (assisted and weighted) exercises, it is not very possible to calculate accurate 1RM estimates.)</span>
								<div class="text-xs">or maybe there is and I just don't know it.</div>
							</div>
						{/if}
						{#each oneRepMaxes as oneRepMax (oneRepMax)}
							<div class="p-[1rem]">{JSON.stringify(oneRepMax)}</div>
						{/each}
					{:else if page === "volume"}
						<div></div>
					{:else if page === "reps"}
						<div></div>
					{/if}
				</div>
			</div>
		</div>

	</div>


</div>
<!--zhi shi bu shi yin guo?

im LITERALLY facing the consequences of my actions brochacho im fried-->