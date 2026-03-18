<script lang="ts">
	import { onMount } from 'svelte';

	let currentTime: Date = $state(new Date);

	let currentHour = $derived(currentTime.getHours());
	let currentMinute = $derived(currentTime.getMinutes());

	onMount(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="w-[100vw] h-[100vh] flex bg-stone-900 text-stone-50">
	<div class="w-[40vw] left-0 h-[100vh] flex">
		<div class="m-[5vw] flex flex-col">
			<div class="w-[30vw] bg-stone-700">
				Dashboard
			</div>
			<!--put ischyros here!!-->
			<!--or, i guess, Karolos Petros Axios, "Ischyros the Whitefist"-->
		</div>

		<!--also need to insert streaks, etc-->
	</div>

	<div class="w-[60vw] right-0 h-[100vh] flex">
		<!--okay i had a layout in mind and then i realized it was kinda cooked so im gonna remake it-->
		<div class="w-[55vw] h-[90vh] ml-[5vw] my-[5vh] flex flex-col gap-[5vh]">
			<!--track workout card thingy-->
			<div
				class="right-0 h-[20vh] bg-stone-800 border border-stone-700 flex text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw]">
				<div class="text-stone-500 text-4xl">
					{currentHour}:{currentMinute}
				</div>
				<div class="text-5xl">
					track workout
				</div>
			</div>

			<!--track weight-->
			<div
				class="right-0 h-[20vh] bg-stone-800 border border-stone-700 flex text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw]">
				<div class="text-5xl">
					track weight
				</div>
			</div>

			<!--settings-->
			<div
				class="right-0 h-[20vh] bg-stone-800 border border-stone-700 flex text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw]">
				<div class="text-5xl">
					settings
					<!--i might actually want to make this one smaller and just a cog?-->
				</div>
			</div>
			<!--stats-->
			<!--make this later but it should be like a big thing and display-->

			<!--stats at a glance?-->


		</div>
	</div>
</div>

<!--the world needs... only one big boss-->