<script lang="ts">
	import { onMount } from 'svelte';
	import idlePath from '$lib/assets/idle.GIF';

	let currentTime: Date = $state(new Date);

	let currentHour = $derived(currentTime.getHours());
	let currentMinute = $derived(currentTime.getMinutes());

	let streak: number = $state(0); //figure out how to derive streak from data later
	let volume: number = $state(0);
	let volumeUnit: "lbs" | "kg" = $state("lbs")

	let cardioTimeSeconds = $state(0)
	let cardioTimeMinutes = $derived(Math.round(cardioTimeSeconds/60));
	let cardioTimeHours = $derived(Math.floor(cardioTimeSeconds/3600));

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
		<div class="mx-[5vw] my-[5vh] flex flex-col">
			<div
				class="w-[30vw] h-[5vh] text-4xl bg-stone-700 text-center align-center items-center justify-center cursor-pointer flex">
				Dashboard
			</div>
			<!--put ischyros here!!-->
			<!--or, i guess, Karolos Petros Axios, "Ischyros the Whitefist"-->
			<img src={idlePath} alt="a really cool idle animation gif of ischyros" class="object-contain h-[40vh]" />

			<!--also need to insert streaks, etc-->
			<div class="w-full h-[10vh] flex flex-row gap-[2vw] items-center align-center justify-center ">
				<!--streak counter-->
				<div class="w-[10vh] h-[10vh] bg-stone-700 text-stone-100 flex flex-col justify-center items-center">
					<div class="text-stone-500">streak</div>
					<div class="text-3xl">
						{streak}
					</div>
				</div>

				<!--weekly volume-->
				<div  class="w-[10vh] h-[10vh] bg-stone-700 text-stone-100 flex flex-col justify-center items-center">
					<div class="text-stone-500">volume</div>
					<div class="text-xl">
						{volume}{volumeUnit}
					</div>
				</div>

				<!--cardio time-->
				<div class="w-[10vh] h-[10vh] bg-stone-700 text-stone-100 flex flex-col justify-center items-center">
					<div class="text-stone-500">cardio</div>
					<div class="text-xl">
						{cardioTimeHours}:{(cardioTimeMinutes < 10) ? `0${cardioTimeMinutes}` : cardioTimeMinutes}
					</div>
				</div>
			</div>

			<!--stats at a glance?-->

		</div>

	</div>

	<div class="w-[60vw] right-0 h-[100vh] flex">
		<!--okay i had a layout in mind and then i realized it was kinda cooked so im gonna remake it-->
		<div class="w-[55vw] h-[90vh] ml-[5vw] my-[5vh] flex flex-col gap-[5vh] items-end">
			<!--track workout card thingy-->
			<div
				class="right-0 w-[55vw] h-[20vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw] hover:translate-x-[-5vw] transition-all hover:border-emerald-400">
				<div class="text-stone-500 text-4xl">
					{currentHour}:{currentMinute}
				</div>
				<div class="text-5xl">
					track workout
				</div>
			</div>

			<!--track weight-->
			<div
				class="right-0 w-[50vw] h-[15vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw] hover:translate-x-[-5vw] transition-all hover:border-emerald-400">
				<div class="text-5xl">
					track weight
				</div>
			</div>


			<!--history-->
			<!--HOW DID I FORGET HISTORY???-->

			<!--PRs-->
			<!--gladius roma belisarius sum.-->

			<!--stats-->
			<!--make this later but it should be like a big thing and display-->

			<!--settings-->
			<div
				class="right-0 h-[20vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw]">
				<div class="text-5xl">
					settings
					<!--i might actually want to make this one smaller and just a cog?-->
				</div>
			</div>
		</div>
	</div>
</div>

<!--the world needs... only one big boss-->