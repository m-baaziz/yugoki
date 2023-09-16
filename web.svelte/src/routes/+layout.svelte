<script lang="ts">
	import '../app.css';
	import Header from './Header/Header.svelte';
</script>

<div class="h-screen flex flex-col">
	<Header --max-width="2520px" />

	<div class="flex-grow mx-auto py-1 max-w-screen-uw">
		<main class="h-full">
			<div class="mx-auto h-full sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>

<style>
	.max-w-screen-uw {
		max-width: 2520px;
	}
</style>
