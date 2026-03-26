<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { TrackingSet } from '$lib/types';

	let { set, weightUnit, updateSet, deleteSetAtOrder }: {
		set: Partial<TrackingSet>,
		weightUnit: 'lbs' | 'kg',
		updateSet: (order: number, field: keyof TrackingSet, value: number | string | boolean) => void,
		deleteSetAtOrder: (targetOrder: number) => void
	} = $props();

	let showToolTip = $state(false);

	const LBS_TO_KG = 0.453592;
	const KG_TO_LBS = 2.20462;

	// lbs (stored) to display unit
	function toDisplay(lbs: number): number {
		return weightUnit === 'kg' ? +(lbs * LBS_TO_KG).toFixed(2) : lbs;
	}

	// display unit to lbs (stored)
	function toLbs(displayVal: number): number {
		return weightUnit === 'kg' ? +(displayVal * KG_TO_LBS).toFixed(4) : displayVal;
	}

	let typeDisplay = $derived(determineType(set));

	let changeTypeDisplayOpen = $state(false);

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

	function handleTypeChange(newType: 'normal' | 'failure' | 'drop' | 'warmup') {
		changeTypeDisplayOpen = false;
		updateSet(set.order!, 'type', newType);
	}

	const handleRPE = (e) => {
		const val = e.currentTarget.valueAsNumber;
		updateSet(set.order!, 'rpe', isNaN(val) ? null : val);
	};

	const handleReps = (e) => {
		const val = e.currentTarget.valueAsNumber;
		updateSet(set.order!, 'reps', isNaN(val) ? null : val);
	};

	const handleWeight = (e) => {
		const val = e.currentTarget.valueAsNumber;
		updateSet(set.order!, 'weight', isNaN(val) ? null : toLbs(val));
	};

	const handleComplete = () => {
		updateSet(set.order!, 'completed', !set.completed)
		console.log("handling complete")
		console.log(set.completed)
	}
</script>
<div class="flex flex-row justify-between items-center align-center content-center mt-[1vh] mx-[2.5vw] transition-all p-[1rem] {set.completed ? 'bg-emerald-900' : ''}">
	<div class="text-stone-400 text-xl font-bold cursor-pointer p-[1rem] w-[1rem] select-none {set.type === 'normal' ? '' : (set.type === 'failure' ? 'text-red-500' : (set.type === 'drop' ? 'text-blue-500' : 'text-orange-400'))}"
					onclick={() => changeTypeDisplayOpen = true}>
		{typeDisplay}
		{#if changeTypeDisplayOpen}
			<div class="absolute flex flex-col bg-stone-100 text-stone-900 font-normal" onclick={(e) => e.stopPropagation()}>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all  cursor-pointer"
								onclick={() => handleTypeChange("normal")}>Normal Set
				</button>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all  cursor-pointer"
								onclick={() => handleTypeChange("failure")}>Failure Set
				</button>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all  cursor-pointer"
								onclick={() => handleTypeChange("drop")}>Drop Set
				</button>
				<button class="p-[0.5rem] hover:bg-stone-400 transition-all cursor-pointer"
								onclick={() => handleTypeChange("warmup")}>Warm Up Set
				</button>
			</div>
		{/if}
	</div>

	<div class="p-[0.5rem] rounded-sm transition-all {set.completed ? 'bg-emerald-400 text-stone-800' : ''}" onclick={handleComplete}>
		{#if set.completed}
			<Icon icon="material-symbols:check-box-outline"/>
		{:else }
			<Icon icon="material-symbols:check-box-outline-blank" />
		{/if}
	</div>

	<div class="flex flex-col">
		<div class="select-none">weight ({weightUnit})</div>
		<input
			type="number"
			value={toDisplay(set.weight ?? 0)}
			oninput={handleWeight}
			class="text-center p-[1rem] w-[5rem] bg-stone-200 text-stone-900"
		/>
	</div>

	<div class="flex flex-col">
		<div class="select-none">reps</div>
		<input
			type="number"
			value={set.reps}
			oninput={handleReps}
			class="text-center p-[1rem] w-[5rem] bg-stone-200 text-stone-900"
		/>

	</div>

	<div class="flex flex-col">
		<div class="flex flex-row items-center align-center select-none">
			RPE
			<Icon icon="material-symbols:question-mark" onmouseout={() => showToolTip = false}
						onmouseenter={() => showToolTip = true} />

			{#if showToolTip}
				<span class="text-xs absolute mb-[5vh] bg-stone-700 p-[1rem]" transition:fly>Rate of Perceived Exertion!</span>
			{/if}
		</div>
		<input
			type="number"
			value={set.rpe}
			oninput={handleRPE}
			class="text-center p-[1rem] w-[5rem] bg-stone-200 text-stone-900"
		/>
	</div>

	<div>
		<button onclick={() => deleteSetAtOrder(set.order!)}>
			<Icon class="cursor-pointer" icon="material-symbols:delete-outline" />
		</button>
		<!--todo: make this open a modal instead-->
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