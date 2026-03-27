<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import "@fontsource/noto-serif"

	let { children } = $props();
</script>

<style>
	:global(body) {
			font-family: "Noto Serif", serif
	}

       /*remove the arrows */
       /* Chrome, Safari, Edge, Opera */
   input::-webkit-outer-spin-button,
   input::-webkit-inner-spin-button {
       -webkit-appearance: none;
       margin: 0; /* Important to remove margin in older Chrome versions */
   }

  /* Firefox */
  input[type=number] {
      -moz-appearance: textfield;
  }
</style>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

