<script>
	import { resolve } from '$app/paths';

	const resolvedLogin = resolve("/login");
</script>

<div> <!--document container and allat-->
	<div> <!--header-->
		<div>katischuo</div>
		<div>know thyself and overcome</div>
	</div>

	<div>
		Yet another gym tracker - open source, built for developers and data heads.
	</div>

	<div>
		κατισχύω: To overpower, to prevail, to be strong against, to overcome.
	</div>

	<a href={resolvedLogin}>
		login
	</a>
</div>