<script lang="ts">
	let { data } = $props();
	let { exerciseCategories, muscleGroups, equipment } = data;
</script>

<div>
	<div>i am too lazy to style things right now but i will do it eventually astaghfirullah</div>

	<form method="POST" action="?/create">
		<div><input type="text" name="exercise_name" id="exercise_name" placeholder="exercise name" required /></div>
		<div><select name="category" id="category" required>
			{#each exerciseCategories as exerciseCategory (exerciseCategory)}
				<option value={exerciseCategory}>{exerciseCategory}</option>
			{/each}
		</select></div>

		<div>
			<p>Primary Muscle</p>
			{#each muscleGroups as muscleGroup (muscleGroup)}
				<label>
					<input type="checkbox" name="primary_muscle" value={muscleGroup} />
					{muscleGroup}
				</label>
			{/each}
		</div>

		<div>
			<p>Secondary Muscles</p>
			{#each muscleGroups as muscleGroup (muscleGroup)}
				<label>
					<input type="checkbox" name="secondary_muscles" value={muscleGroup} />
					{muscleGroup}
				</label>
			{/each}
		</div>

		<div>
			<select name="equipment" id="equipment">
				{#each equipment as equipmentName (equipmentName)}
					<option value={equipmentName}>{equipmentName}</option>
					{/each}
			</select>
		</div>

		<button type="submit">create exercise</button>
	</form>
</div>