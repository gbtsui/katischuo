<script>
	import { resolve } from '$app/paths';
</script>

<div class="w-[100vw] h-[100vh] bg-stone-900 text-stone-50 flex flex-row"> <!--document container and allat-->
	<div class="w-[40vw] h-[100vh] bg-stone-800 text-stone-400 flex flex-col align-center justify-center "> <!--header-->
		<div>
			<div class="text-3xl ml-[5vw]">katischuo</div>
			<div class="text-lg ml-[5vw]">know yourself and overcome</div>
		</div>
		<div class="mt-[3rem] mx-[1rem]">
			<span class="font-bold">κατισχύω</span>: To overpower, to prevail, to be strong against, to overcome.
		</div>
	</div>

	<div class="w-[60vw] h-[100vh] flex flex-col text-center align-center items-center justify-center gap-[10vh]">
		<div class="w-full text-center">
			yet another gym tracker. maybe with a bit more data though
		</div>

		<a href={resolve("/login")} class="text-xl m-[2rem] p-[4rem] bg-stone-700 w-min hover:p-[5rem] transition-all ">
			login
		</a>
	</div>

</div>
