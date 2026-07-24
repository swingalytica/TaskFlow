<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';

	function goBack() {
		window.history.back();
	}
</script>

<!--Button to go back with a click event listener-->
<button class="ml-4" onclick={goBack} aria-label="Go back"><ArrowLeft /></button>

<style>
	/* Styling for the button */
	button {
		text-decoration: underline;
		text-underline-offset: 0.1rem;
		font-size: var(--small-font);
		border: none !important;
		background-color: transparent !important;
		box-shadow: none !important;
		margin-top: 1rem;

		&:focus {
			outline: none !important;
		}
	}
</style>
