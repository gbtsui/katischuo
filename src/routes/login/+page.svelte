<script lang="ts">
	import {slide} from "svelte/transition"
	import {authClient} from '$lib/auth-client';

	let email = "";
	let password = "";
	let error: string | undefined = undefined;



	async function handleSignup() {
		const { data, error: err } = await authClient.signUp.email({
			email,
			password,
			name: email.split('@')[0], // optional display name
		});

		if (err) {
			error = err.message;
		} else {
			window.location.href = '/dashboard'; // redirect on success
		}
	}
</script>

<div class="flex items-center justify-center w-[100vw] h-[100vh]">
	<div class="flex flex-row p-5 bg-gray-100 w-1/2 h-2/3 items-center justify-center">
		<div class="text-2xl w-1/2">
			Login
		</div>
		<div class="w-1/2">
			<div transition:slide>
				<form on:submit|preventDefault={handleSignup} class="flex flex-col gap-3 mr-2 items-end text-end">
					<input type="email" bind:value={email} placeholder="email" required class="text-end p-3"/>
					<input type="password" bind:value={password} placeholder="password" required class="text-end p-3"/>
					<button type="submit" class="text-end p-3 bg-gray-200 hover:bg-gray-800 hover:text-white transition-all">Sign Up</button>
					{#if error}
						<p class="bg-red-500 p-3 text-white">{error}</p>
					{/if}
				</form>
			</div>
		</div>
	</div>
</div>
