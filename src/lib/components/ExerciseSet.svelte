<script lang="ts">
	import {fly} from 'svelte/transition';

	let {set, weightUnit, updateSet} = $props()

	let showToolTip = $state(false)

	// lbs (stored) to display unit
	function toDisplay(lbs: number): number {
		return weightUnit === 'kg' ? +(lbs * LBS_TO_KG).toFixed(2) : lbs;
	}

	// display unit to lbs (stored)
	function toLbs(displayVal: number): number {
		return weightUnit === 'kg' ? +(displayVal * KG_TO_LBS).toFixed(4) : displayVal;
	}
</script>
<div class="flex flex-row justify-around items-center mt-[2.5vh]">
	<div class="text-stone-400 text-xl font-bold">
		{set.order}
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
			class="text-center p-[1rem] w-[10rem] bg-stone-200 text-stone-900"
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
			class="text-center p-[1rem] w-[10rem] bg-stone-200 text-stone-900"
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
			class="text-center p-[1rem] w-[10rem] bg-stone-200 text-stone-900"
		/>
	</div>
</div>