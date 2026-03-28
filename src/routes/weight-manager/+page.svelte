<script lang="ts">
	import { fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import type { SelectTrackedWeightDataPoint } from '$lib/db/schema.js';
	import { onMount } from 'svelte';


	let weightRecords: SelectTrackedWeightDataPoint[] = $state([]);

	let weightInput: number | null = $state(null);
	let notesInput: string = $state('');
	let weightUnitInput: "lbs" | "kg" = $state("lbs") //TODO: add function to query for actual preferred weight unit

	let trackLoading = $state(false);

	const updateWeightRecords = async () => {
		//const res = await fetch(resolve("/api/"))
		const res = await fetch(resolve('/api/get-weight-records')).then(res => res.json());
		weightRecords = res.records;
	};


	const handleRecordWeight = async () => {
		if (!weightInput) return;

		trackLoading = true;
		const res = await fetch(resolve('/api/create-weight-record'), {
			method: 'POST',
			body: JSON.stringify({
				weight: weightInput,
				notes: notesInput,
				weightUnit: weightUnitInput,
			})
		});
		if (!res.ok) {
			console.error(res)
		}

		await updateWeightRecords()
		weightInput = null;
		notesInput = "";

		trackLoading = false
	};


	onMount(async () => {
		await updateWeightRecords();
	});

	//okay like i guess bro
</script>


<div
	class="flex items-center w-[100vw] h-[100vh] flex-col align-center justify-start overflow-hidden text-stone-50 bg-stone-900 ">
	<div class="text-2xl h-[10vh] mt-[5vh]" transition:fly>Track Weight</div>
	<a href={resolve("/dashboard")}
		 class="absolute top-[2.5vh] left-0 w-[15vw] h-[3.5rem] bg-stone-700 text-center justify-center flex items-center hover:w-[17.5vw] hover:text-xl cursor-pointer transition-all ">Dashboard</a>

	<div class="w-[80vw] h-[80vh] gap-[5vw] flex flex-row ">
		<!--history section-->
		<div class="flex flex-col gap-[1rem]">
			<div class="text-xl">Historical Data</div>
			<div class="w-[37.5vw] h-[30vh] bg-stone-800 overflow-y-scroll [&::-webkit-scrollbar]:w-[1vw]
  [&::-webkit-scrollbar-track]:bg-stone-500
  [&::-webkit-scrollbar-thumb]:bg-stone-800
		[&::-webkit-scrollbar]:mx-[1vw]" transition:fly={{delay: 67*2}}>
				<div class="flex flex-col p-[1rem] gap-[0.5rem]">
					{#each weightRecords as record (record)}
						<div>{JSON.stringify(record)}</div>
					{/each}

					{#if !weightRecords.length}
						<div>no records found (yet)!</div>
					{/if}
				</div>
			</div>
			<div class="w-[37.5vw] h-[30vh] bg-stone-800">
				graph goes here
			</div>
		</div>

		<!--track weight section-->
		<div class="flex flex-col gap-[1rem]">
			<div>Track Weight</div>
			<div class="w-[37.5vw] h-[62.5vh] bg-stone-800 overflow-y-scroll [&::-webkit-scrollbar]:w-[1vw]
[&::-webkit-scrollbar-track]:bg-stone-500
[&::-webkit-scrollbar-thumb]:bg-stone-800
[&::-webkit-scrollbar]:mx-[1vw]" transition:fly={{delay: 67}}>
				<div class="p-[2rem] flex flex-col gap-[2rem] justify-between ">
					<div class="flex flex-col gap-[2rem]">
						<div>
							<div>Current Weight</div>
							<input bind:value={weightInput} type="number" placeholder="100.0"
										 class="bg-stone-700 focus:border-none focus:outline-none" />
							<select class="bg-stone-700" bind:value={weightUnitInput}>
								<option value="lbs">lbs</option>
								<option value="kg">kg</option>
							</select>
						</div>
						<div>
							<div>Notes</div>
							<textarea bind:value={notesInput}
												class="bg-stone-700 resize-none field-sizing-content min-h-[5rem] max-h-[30rem] w-full"></textarea>
						</div>
					</div>
					{#if !trackLoading}
						<div>
							<button
								class="p-[1rem]  hover:text-2xl transition-all text-xl {weightInput === null || weightInput === 0 ?  'bg-stone-900 cursor-not-allowed text-stone-400' : 'bg-stone-700 hover:p-[1.5rem] cursor-pointer' }"
								onclick={handleRecordWeight}>Track!
							</button>
						</div>
					{:else }
						<div>Loading...</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>