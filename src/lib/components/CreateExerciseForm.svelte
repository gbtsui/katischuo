<script lang="ts">
	//const { exerciseCategories, muscleGroups, equipment } = $props();

	import { exerciseCategoryEnum, muscleGroupEnum, strengthExerciseEquipmentEnum } from '$lib/db/schema';
	import {fly} from 'svelte/transition';

	const exerciseCategories = exerciseCategoryEnum.enumValues
	const muscleGroups = muscleGroupEnum.enumValues
	const equipment = strengthExerciseEquipmentEnum.enumValues;

	let modalOpen = $state(false)
	let allRequiredFieldsFilled = $state(false)
	let successMessage = $state<string | null>(null)
	let errorMessage = $state<string | null>(null)
	let isSubmitting = $state(false)

	let formRef = $state<HTMLFormElement | null>(null)

	function checkRequiredFields() {
		if (!formRef) return
		const name = (formRef.querySelector('[name="exercise_name"]') as HTMLInputElement)?.value.trim()
		const category = (formRef.querySelector('[name="category"]') as HTMLSelectElement)?.value
		allRequiredFieldsFilled = !!name && !!category
	}

	async function handleCreateExercise() {
		if (!formRef) return;

		successMessage = null
		errorMessage = null
		isSubmitting = true

		const formData = new FormData(formRef);

		try {
			const res = await fetch('/api/create-new-exercise', {
				method: "POST",
				body: formData,
			});

			const result = await res.json();

			if (!res.ok) {
				errorMessage = result.message ?? 'Unknown error.'
				console.error(result.message) //帝王绿貔貅 趋吉避凶
			} else {
				successMessage = "exercise created successfully!"
				formRef.reset()
				allRequiredFieldsFilled = false
				setTimeout(() => {
					modalOpen = false
					successMessage = null
				}, 1500);
			}
		} catch (err0rc0dezer0) {
			errorMessage = "network error. maybe try again?"
			console.error(err0rc0dezer0)
		} finally {
			isSubmitting = false
		}
	}

	function closeModal() {
		modalOpen = false
		successMessage = null
		errorMessage = null
	}
</script>

<!--le BOUTON!!!!!-->
<div>
	<button onclick={() => (modalOpen = true)} class="w-[10rem] h-[5rem] m-[1rem] bg-stone-800">
		+ Create Exercise
	</button>
</div>

<!--le MODAL!!!! (je ne sais pas le propre mot en francais)-->
{#if modalOpen}
	<div
		class="fixed inset-0 bg-stone-900/20 flex items-center justify-center"
		onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
		role="dialog"
		aria-modal="true"
		aria-label="Create Exercise"
		tabindex="-1"
		onkeydown={(e) => {if (e.key === "Escape") closeModal(); }}
	>
		<!--HAHA I FINALLY FIGURED OUT HOW TO DO KEYBOARD THINGYS-->
		<div class="w-[75vw] h-[80vh] flex flex-col bg-stone-800 shadow-lg overflow-y-auto p-6 gap-4" transition:fly>
			<div class="flex justify-between items-center">
				<h2 class="text-lg font-semibold">Create Exercise</h2>
				<button onclick={closeModal} aria-label="Close">✕</button>
			</div>

			<form bind:this={formRef} oninput={checkRequiredFields} class="flex flex-col gap-4">
				<div>
					<label for="exercise_name">Exercise Name</label>
					<input type="text" name="exercise_name" id="exercise_name" placeholder="Exercise name" required />
				</div>

				<div>
					<label for="category">Category</label>
					<select name="category" id="category" required class="bg-stone-800">
						<!--style ts later -->
						{#each exerciseCategories as category (category)}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>

				<fieldset>
					<legend>Primary Muscle</legend>
					{#each muscleGroups as muscleGroup (muscleGroup)}
						<label>
							<input type="checkbox" name="primary_muscle" value={muscleGroup} />
							{muscleGroup}
						</label>
					{/each}
				</fieldset>

				<fieldset>
					<legend>Secondary Muscles</legend>
					{#each muscleGroups as muscleGroup (muscleGroup)}
						<label>
							<input type="checkbox" name="secondary_muscles" value={muscleGroup} />
							{muscleGroup}
						</label>
					{/each}
				</fieldset>

				<div>
					<label for="equipment">Equipment</label>
					<select name="equipment" id="equipment">
						<option value="">None</option>
						{#each equipment as item (item)}
							<option value={item}>{item}</option>
						{/each}
					</select>
				</div>
			</form>

			{#if successMessage}
				<p class="text-green-600">{successMessage}</p>
			{/if}
			{#if errorMessage}
				<p class="text-red-600">Error! {errorMessage}</p>
			{/if}

			<button
				onclick={handleCreateExercise}
				disabled={isSubmitting || !allRequiredFieldsFilled}
			>
				{isSubmitting ? 'Creating...' : 'Confirm'}
			</button>
		</div>
	</div>
{/if}

<!--how much can you take?-->
<!--come what may, feel the pain-->