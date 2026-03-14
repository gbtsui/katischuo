<script lang="ts">
	import { slide } from 'svelte/transition';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const seshAtom = authClient.useSession();

	$effect(() => {
		if ($seshAtom.data) {
			goto(resolve('/dashboard'));
		}
	});

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error: string | undefined = $state(undefined);
	let loading = $state(false);

	let mode: 'login' | 'signup' = $state('login');

	async function handleSignup() {
		loading = true;
		const { error: err } = await authClient.signUp.email({
			email,
			password,
			name
		});

		loading = false;

		if (err) {
			error = err.message;
		} else {
			goto(resolve('/dashboard'));
		}
	}

	async function handleSignin() {
		loading = true;
		const { error: err } = await authClient.signIn.email({
			email,
			password
		});

		loading = false;

		if (err) {
			error = err.message;
		} else {
			goto(resolve('/dashboard'));
		}
	}
</script>

<div class="flex items-center justify-center w-[100vw] h-[100vh]">
	<div
		class="flex flex-row p-5 bg-gray-100 md:w-2/3 md:h-2/3 items-center justify-center xs:w-5/6 xs:h-4/5 sm:w-3/4 xs:h-4/5 lg:w-1/2 lg:h-2/3">
		<div class="w-1/2">
			{#if mode === "signup"}
				<div transition:slide class="flex flex-col gap-2">
					<div class="text-2xl w-1/2 ml-2">Sign Up</div>
					<button onclick={() => mode = "login"}
									class="text-start w-1/2 p-2 rounded-md cursor-pointer hover:bg-gray-800 hover:text-white transition-all">
						already have an account?
					</button>
				</div>
			{:else }
				<div transition:slide class="flex flex-col gap-2">
					<div class="text-2xl w-1/2 ml-2">Login</div>
					<button onclick={() => mode = "signup"}
									class="text-start w-1/2 p-2 rounded-md cursor-pointer hover:bg-gray-800 hover:text-white transition-all">
						don't have an account?
					</button>
				</div>
			{/if}
		</div>
		<div class="w-1/2">

			{#if mode === "signup"}
					{#if !loading}
						<form onsubmit={handleSignup} class="flex flex-col gap-3 mr-2 items-end text-end">
							<input type="email" bind:value={email} placeholder="email" required class="text-end p-3" />
							<input type="text" bind:value={name} placeholder="name" required class="text-end p-3" />
							<input type="password" bind:value={password} placeholder="password" required class="text-end p-3" />
							<button type="submit" class="text-end p-3 bg-gray-200 hover:bg-gray-800 hover:text-white transition-all cursor-pointer">
								Sign Up
							</button>
							{#if error}
								<p class="bg-red-500 p-3 text-white">{error}</p>
							{/if}
						</form>
					{:else }
						<p>loading...</p>
					{/if}
			{:else }

				<div transition:slide>
					{#if !loading}
						<form onsubmit={handleSignin} class="flex flex-col gap-3 mr-2 items-end text-end">
							<input type="email" bind:value={email} placeholder="email" required class="text-end p-3" />
							<input type="password" bind:value={password} placeholder="password" required class="text-end p-3" />
							<button type="submit" class="text-end p-3 bg-gray-200 hover:bg-gray-800 hover:text-white transition-all cursor-pointer">
								Login
							</button>
							{#if error}
								<p class="bg-red-500 p-3 text-white">{error}</p>
							{/if}
						</form>
					{:else }
						<p>loading...</p>
					{/if}
				</div>

			{/if}
		</div>
	</div>
</div>
<!--when you can't even say my name, has the memory gone? are you feeling numb?-->