<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { exerciseCategories, muscleGroups, equipment } = data;

	let successMessage = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);
	let isSubmitting = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		successMessage = null;
		errorMessage = null;
		isSubmitting = true;

		const formData = new FormData(e.target as HTMLFormElement);

		try {
			const res = await fetch('/api/create-new-exercise', {
				method: 'POST',
				body: formData,
			});

			const result = await res.json();

			if (!res.ok) {
				errorMessage = result.message ?? 'Something went wrong.';
			} else {
				successMessage = 'Exercise created successfully!';
				(e.target as HTMLFormElement).reset();
			}
		} catch {
			errorMessage = 'Network error, please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<div>
		<label for="exercise_name">Exercise Name</label>
		<input type="text" name="exercise_name" id="exercise_name" placeholder="Exercise name" required />
	</div>

	<div>
		<label for="category">Category</label>
		<select name="category" id="category" required>
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

	<button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Creating...' : 'Create Exercise'}
	</button>

	{#if successMessage}
		<p>{successMessage}</p>
	{/if}
	{#if errorMessage}
		<p>Error: {errorMessage}</p>
	{/if}
</form>