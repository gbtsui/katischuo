<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { InsertSet } from '$lib/db/schema';

	let { set, weightUnit, updateSet }: {
		set: Partial<InsertSet>,
		weightUnit: 'lbs' | 'kg',
		updateSet: (order, field, value) => void
	} = $props();

	let showToolTip = $state(false);

	// lbs (stored) to display unit
	function toDisplay(lbs: number): number {
		return weightUnit === 'kg' ? +(lbs * LBS_TO_KG).toFixed(2) : lbs;
	}

	// display unit to lbs (stored)
	function toLbs(displayVal: number): number {
		return weightUnit === 'kg' ? +(displayVal * KG_TO_LBS).toFixed(4) : displayVal;
	}

	let typeDisplay = $derived(determineType(set));

	let changeTypeDisplayOpen = $state(false)

	function determineType(setData) {
		if (setData.type === 'normal') {
			return setData.order as string;
		} else if (setData.type === 'failure') {
			return 'F';
		} else if (setData.type === 'drop') {
			return 'D';
		} else if (setData.type === 'warmup') {
			return 'W';
		}

		return setData.order;
	}

	function handleTypeChange(newType: "normal" | "failure" | "drop" | "warmup") {
		changeTypeDisplayOpen = false;
		updateSet(set.order!, 'type', newType);
	}
</script>
<div class="flex flex-row justify-around items-center mt-[2.5vh]">
	<div class="text-stone-400 text-xl font-bold cursor-pointer p-[1rem] w-[1rem] select-none" onclick={() => changeTypeDisplayOpen = true} >
		{typeDisplay}
		{#if changeTypeDisplayOpen}
			<div class="absolute flex flex-col bg-stone-100 text-stone-900 font-normal" onclick={(e) => e.stopPropagation()}>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all  cursor-pointer" onclick={() => handleTypeChange("normal")}>Normal Set</button>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all  cursor-pointer"  onclick={() => handleTypeChange("failure")}>Failure Set</button>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all  cursor-pointer"  onclick={() => handleTypeChange("drop")}>Drop Set</button>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all cursor-pointer"  onclick={() => handleTypeChange("warmup")}>Warm Up Set</button>
			</div>
		{/if}
	</div>


	<div class="flex flex-col">
		<div>weight ({weightUnit})</div>
		<input
			type="number"
			value={toDisplay(set.weight ?? 0)}
			oninput={(e) => {
						const val = e.currentTarget.valueAsNumber;
						updateSet(set.order!, 'weight', isNaN(val) ? null : toLbs(val));
					}}
			class="text-center p-[1rem] w-[5rem] bg-stone-200 text-stone-900"
		/>
	</div>

	<div class="flex flex-col">
		<div>reps</div>
		<input
			type="number"
			value={set.reps}
			oninput={(e) => {
						const val = e.currentTarget.valueAsNumber;
						updateSet(set.order!, 'reps', isNaN(val) ? null : val);
					}}
			class="text-center p-[1rem] w-[5rem] bg-stone-200 text-stone-900"
		/>

	</div>

	<div class="flex flex-col">
		<div class="flex flex-row items-center align-center">
			RPE
			<span class="material-symbols-outlined cursor-help" onmouseout={() => showToolTip = false}
						onmouseenter={() => showToolTip = true}>help</span>

			{#if showToolTip}
				<span class="text-xs absolute mb-[5vh] bg-stone-700 p-[1rem]" transition:fly>Rate of Perceived Exertion!</span>
			{/if}
		</div>
		<input
			type="number"
			value={set.rpe}
			oninput={(e) => {
						const val = e.currentTarget.valueAsNumber;
						updateSet(set.order!, 'rpe', isNaN(val) ? null : val)
					}}
			class="text-center p-[1rem] w-[5rem] bg-stone-200 text-stone-900"
		/>
	</div>
</div>

<style>
    /*remove the arrows */
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0; /* Important to remove margin in older Chrome versions */
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>