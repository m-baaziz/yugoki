<script lang="ts">
	import '../app.css';
	import Header from './Header/Header.svelte';
</script>

<div class="min-h-full">
	<Header --max-width="2520px" />

	<div class="py-10">
		<main>
			<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>
