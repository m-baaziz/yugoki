<script lang="ts">
	import type { MapEntry } from '$lib/MapEntry';
	import Stars from './Stars.svelte';

	export let entries: MapEntry[];
</script>

<div class="bg-white">
	<div class="w-full px-6 lg:px-8">
		<div
			role="list"
			class="-mx-px grid grid-cols-1 sm:grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7"
		>
			{#each entries as entry (entry.id)}
				<div class="group relative flex flex-col h-full p-4 sm:p-6">
					<div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg group-hover:opacity-75">
						<img
							src={entry.image}
							alt={entry.name}
							class="h-full w-full object-cover object-center"
						/>
					</div>
					<div class="flex flex-col flex-grow pb-4 pt-7 text-center">
						<h3 class="text-sm font-medium text-gray-900">
							<a href="/">
								<span aria-hidden="true" class="absolute inset-0" />
								{entry.name}
							</a>
						</h3>
						<p class="flex-grow text-sm leading-7 text-gray-600">{entry.shortDescription}</p>
						<div class="mt-3 flex flex-col items-center">
							<p class="sr-only">{entry.reviews.rating} out of 5 stars</p>
							<Stars value={entry.reviews.rating} />
							<p class="mt-1 text-sm text-gray-500">{entry.reviews.count} reviews</p>
						</div>
						<div class="mt-4">
							<span class="text-xs text-gray-500">from</span>
							<span class="ml-2 text-base font-medium text-gray-900">
								${entry.startingPrice} / month
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
