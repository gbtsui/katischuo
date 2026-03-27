<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import idlePath from '$lib/assets/idle.GIF';
	import { resolve } from '$app/paths';

	let currentTime: Date = $state(new Date);

	let currentHour = $derived(currentTime.getHours());
	let currentMinute = $derived(currentTime.getMinutes());
	let currentSecond = $derived(currentTime.getSeconds());

	let streak: number = $state(0); //figure out how to derive streak from data later
	let volume: number = $state(0);
	let volumeUnit: 'lbs' | 'kg' = $state('lbs');

	let cardioTimeSeconds = $state(0);
	let cardioTimeMinutes = $derived(Math.round(cardioTimeSeconds / 60));
	let cardioTimeHours = $derived(Math.floor(cardioTimeSeconds / 3600));

	let lastTrackedWeight = $state(0);
	let lastTrackedWeightTime = $state(new Date()); //guhh change this later..

	let rightSideVisible = $state(false);

	onMount(() => {
		rightSideVisible = true;

		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="w-[100vw] h-[100vh] flex bg-stone-900 text-stone-50 overflow-hidden">
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
			<div class="flex flex-col items-center gap-[2.5vh]">
				<div class="bg-stone-800 border border-stone-700 w-1/2 h-[4vh] text-xl justify-center flex items-center  text-center align-center">This Week</div>
				<div class="w-full h-[10vh] flex flex-row gap-[2vw] items-center align-center justify-center">
					<!--streak counter-->
					<div class="w-[10vh] h-[10vh] bg-stone-700 text-stone-100 flex flex-col justify-center items-center">
						<div class="text-stone-500">streak</div>
						<div class="text-3xl">
							{streak}
						</div>
					</div>

					<!--weekly volume-->
					<div class="w-[10vh] h-[10vh] bg-stone-700 text-stone-100 flex flex-col justify-center items-center">
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
			</div>

			<!--stats at a glance?-->

		</div>

	</div>

	{#if rightSideVisible}
		<div class="w-[60vw] right-0 h-[100vh] flex">
			<div class="w-[55vw] h-[90vh] ml-[5vw] my-[5vh] flex flex-col gap-[5vh] items-end overflow-hidden">
				<!--track workout card thingy-->
				<a
					class="right-0 w-[50vw] h-[20vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-col hover:translate-x-[-5vw] transition-all hover:border-emerald-400"
					transition:fly={{x: "50vw", duration: 1000}}
					href={resolve("/track")}
				>
					<div class="text-stone-500 text-4xl">
						{currentHour}:{currentMinute}:{currentSecond}
					</div>
					<div class="text-5xl">
						track workout
					</div>
				</a>

				<!--track weight-->
				<a
					class="right-0 w-[45vw] h-[15vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-col hover:translate-x-[-5vw] transition-all hover:border-emerald-400"
					transition:fly={{x: "50vw", duration: 1000, delay: 67}}
					href={resolve("/weight-manager")}
				>
					<div class="text-5xl">
						<div class="text-stone-500 text-3xl">
							last tracked weight: {lastTrackedWeight}{volumeUnit} @ {lastTrackedWeightTime.getHours()}:{lastTrackedWeightTime.getMinutes()}  {lastTrackedWeightTime.getFullYear()}/{lastTrackedWeightTime.getMonth()}/{lastTrackedWeightTime.getDate()}
						</div>
						<div>track weight</div>
					</div>
				</a>

				<div
					class="right-0 w-[45vw] h-[10vh]  text-center align-center items-center justify-center flex flex-row gap-[5vw]"
					transition:fly={{x: "50vw", duration: 1000, delay: 67}}
				>
					<!--history-->
					<!--HOW DID I FORGET HISTORY???-->
					<a class="bg-stone-800 border border-stone-700 h-[10vh] w-[20vw] hover:translate-x-[-2.5vw] transition-all hover:border-emerald-400 text-center align-center items-center justify-center cursor-pointer flex text-2xl"
							 transition:fly={{x: "50vw", duration: 1000, delay: 67*2}} href={resolve("/history")}>
						<div>history</div>
					</a>

					<!--PRs-->
					<!--gladius roma belisarius sum.-->
					<div class="bg-stone-800 border border-stone-700 h-[10vh] w-[20vw] hover:translate-x-[-2.5vw] transition-all hover:border-emerald-400 text-center align-center items-center justify-center cursor-pointer flex text-2xl"
							 transition:fly={{x: "50vw", duration: 1000, delay: 67*3}}>
						<div>records</div>
					</div>
				</div>

				<div
					class="right-0 w-[45vw] h-[15vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-col hover:translate-x-[-5vw] transition-all hover:border-emerald-400"
					transition:fly={{x: "50vw", duration: 1000, delay: 67*4}}>
					<div class="text-5xl">
						stats
					</div>
				</div>


				<!--stats-->
				<!--make this later but it should be like a big thing and display-->

				<!--settings-->
				<div
					class="right-0 h-[20vh] bg-stone-800 border border-stone-700 text-center align-center items-center justify-center cursor-pointer flex flex-row gap-[2.5vw]">
					<div class="text-xl">
						settings
						<!--i might actually want to make this one smaller and just a cog?-->
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!--the world needs... only one big boss-->