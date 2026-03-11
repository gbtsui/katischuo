<script lang="ts">
	import {authClient} from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const sesh = authClient.useSession();

	if (sesh) {
		goto(resolve('/dashboard'));
	} else {
		goto(resolve('/login'));
	}
</script>

<p>
	{JSON.stringify($sesh.data)}
</p>