<script>
	import {authClient} from '$lib/auth-client';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	const signOut = async () => {
		console.log("Bravo Six, Going Dark.")
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto(resolve("/login/callback"))
				}
			}
		});

	}

	const goBack = () => {

	}
</script>

<div>
	<div>
		are you sure you want to log out?
	</div>
	<div>
		<button onclick={goBack}>no, take me back</button>
		<button onclick={signOut}>logout</button>
	</div>
</div>