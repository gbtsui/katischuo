<script>
	import { resolve } from '$app/paths';
</script>

<div class="w-[100vw] h-[100vh] bg-stone-900 text-stone-50 flex flex-row"> <!--document container and allat-->
	<div class="w-[40vw] h-[100vh] bg-stone-800 text-stone-400 flex flex-col align-center justify-center "> <!--header-->
		<div class="justify-self-start">
			<div class="ml-[5vw] font-extralight text-6xl">katischuo</div>
			<div class="text-lg ml-[5vw]">know yourself and overcome</div>
		</div>
		<div class="mt-[3rem] mx-[1rem]">
			<div class="font-semibold text-5xl">κατισχύω</div>
			<div class="mt-[1rem] border-l-stone-400 border-l-2 pl-[0.5rem]">
				<em>v.</em> To overpower, to prevail, to be strong against, to overcome.
			</div>
		</div>
	</div>

	<div class="w-[60vw] h-[100vh] flex flex-col text-center align-center items-center justify-center gap-[10vh]">
		<div class="w-[40vw]">
			<div class="text-lg uppercase mb-[1rem]">yet another gym tracker</div>
			<div class="text-3xl font-light">maybe with a bit more <em class="font-bold">data</em> though</div>
		</div>

		<a href={resolve("/login")} class="text-xl m-[2rem] p-[4rem] bg-stone-700 w-min hover:p-[5rem] transition-all ">
			login
		</a>
	</div>

</div>
