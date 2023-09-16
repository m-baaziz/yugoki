<script lang="ts">
	import '../app.css';
	import Header from './Header/Header.svelte';
</script>

<div class="min-h-full">
	<Header --max-width="2520px" />

	<div class="mx-auto py-1 max-w-screen-uw">
		<main>
			<div class="mx-auto sm:px-6 lg:px-8">
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
