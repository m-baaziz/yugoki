<script lang="ts">
	import carousel, { type EmblaCarouselType } from 'embla-carousel-svelte';
	import type { MapEntry } from '$lib/MapEntry';
	import Stars from './Stars.svelte';

	export let entries: MapEntry[];
	let carouselApis: Map<string, EmblaCarouselType> = new Map();
</script>

<div class="bg-white">
	<div class="w-full px-6 lg:px-8">
		<div
			role="list"
			class="-mx-px grid grid-cols-1 sm:grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7"
		>
			{#each entries as entry (entry.id)}
				<div class="group relative flex flex-col h-full p-4 sm:p-6">
					<div class="relative flex">
						<div
							class="overflow-hidden"
							use:carousel
							on:emblaInit={({ detail }) => {
								detail.on('scroll', () => {
									carouselApis = carouselApis;
								});
								carouselApis.set(entry.id, detail);
								carouselApis = carouselApis;
							}}
						>
							<div class="flex aspect-h-1 aspect-w-1 rounded-lg group-hover:opacity-95">
								{#each entry.images as imgSrc, i (i)}
									<div class="carousel-slide">
										<img
											src={imgSrc}
											alt={entry.name}
											class="h-full w-full object-cover object-center"
										/>
									</div>
								{/each}
							</div>
						</div>
						{#if carouselApis.get(entry.id)?.canScrollPrev()}
							<button
								type="button"
								class="absolute left-2 self-center rounded-full bg-gray-100 p-1 text-black shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 opacity-70 invisible hover:opacity-100 group-hover:visible"
								on:click|preventDefault={() => carouselApis.get(entry.id)?.scrollPrev()}
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
								</svg>
							</button>
						{/if}
						{#if carouselApis.get(entry.id)?.canScrollNext()}
							<button
								type="button"
								class="absolute right-2 self-center rounded-full bg-gray-100 p-1 text-black shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 opacity-70 invisible hover:opacity-100 group-hover:visible"
								on:click|preventDefault={() => carouselApis.get(entry.id)?.scrollNext()}
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
								</svg>
							</button>
						{/if}
					</div>
					<a class="flex-grow" href="/">
						<div class="flex flex-col h-full pb-4 pt-7 text-center">
							<h3 class="text-sm font-medium text-gray-900">
								{entry.name}
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
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.carousel-slide {
		flex: 0 0 100%;
		min-width: 0;
	}
</style>
