<script lang="ts">
	let { data } = $props();
	let { exerciseCategories, muscleGroups, equipment } = data;
</script>

<div>
	<div>i am too lazy to style things right now but i will do it eventually astaghfirullah</div>

	<form>
		<div><input type="text" name="exercise_name" id="exercise_name" placeholder="exercise name" required /></div>
		<div><select name="category" id="category" required>
			{#each exerciseCategories as exerciseCategory (exerciseCategory)}
				<option value={exerciseCategory}>{exerciseCategory}</option>
			{/each}
		</select></div>
		<div>
			{#each muscleGroups as muscleGroup (muscleGroup)}
				<input type="checkbox" value={muscleGroup}>{muscleGroup}/>
			{/each}
		</div>
		<div>
			{#each muscleGroups as muscleGroup (muscleGroup)}
				<input type="checkbox" value={muscleGroup}>{muscleGroup}/>
			{/each}
		</div>
		<div>
			<select name="equipment" id="equipment">
				{#each equipment as equipmentName (equipmentName)}
					<option value={equipmentName}>{equipmentName}</option>
					{/each}
			</select>
		</div>
	</form>
</div>