<script>
	import { onMount } from 'svelte';

	let loading = $state(true);
	let workoutNumber = $state(-1);
	let templateName = $state('Empty Workout');

	let workoutName = $derived(templateName);
	let workoutNameSelected = $state(false);

	onMount(() => {
		loading = false
	})
</script>


{#if !loading}
	<div class="w-[100vw] min-h-[100vh] flex bg-stone-900 text-stone-50 items-center justify-center ">
		<div class="w-[70vw] min-h-[50vh] bg-stone-800 border border-stone-700 flex flex-col">
			<div class="w-[60vw] mx-[5vw] mt-[5vh] flex flex-col bg-stone-800 px-[2.5vw] py-[2.5vh] text-3xl"
					 class:selected={workoutNameSelected}>
				<input class="focus:outline-none focus:border-none" placeholder="workout name" bind:value={workoutName}
							 onfocusin={workoutNameSelected = true} onfocusout={workoutNameSelected = false} />
				{#if workoutNameSelected}
					selected
				{/if}
			</div>
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