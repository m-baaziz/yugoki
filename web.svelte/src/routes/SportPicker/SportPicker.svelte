<script lang="ts">
	import './SportPicker.css';
	import { inview } from 'svelte-inview';
	import { sports } from '$lib/Sport';

	let sportListElmt: HTMLDivElement | undefined;
	$: maxScrollWidth = sportListElmt?.scrollWidth;
	let selectedSport: string | undefined;
	let firstElementInView = true;
	let lastElementInView = false;

	const scrollLeft = async () => {
		sportListElmt?.scroll({
			left: Math.max(sportListElmt.scrollLeft - sportListElmt.clientWidth, 0),
			behavior: 'smooth'
		});
	};

	const scrollRight = async () => {
		sportListElmt?.scroll({
			left: Math.min(sportListElmt.scrollLeft + sportListElmt.clientWidth, maxScrollWidth!),
			behavior: 'smooth'
		});
	};
</script>

<div class="mx-auto flex w-full items-center justify-between p-6">
	<div class="flex pb-2" class:invisible={firstElementInView}>
		<button
			type="button"
			class="mx-auto rounded-full bg-gray-100 p-1 text-black shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
			on:click|preventDefault={scrollLeft}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
			</svg>
		</button>
	</div>
	<div
		bind:this={sportListElmt}
		class="flex flex-grow flex-row max-w-full overflow-x-scroll no-scrollbar"
	>
		<div
			class="flex-shrink-0 px-1"
			use:inview
			on:inview_change={({ detail: { inView } }) => {
				firstElementInView = inView;
			}}
		/>
		{#each sports as { id, name, icon } (id)}
			<button
				class="flex-shrink-0 items-center px-4 text-sm font-medium"
				class:unselected-sport={id !== selectedSport}
				class:selected-sport={id === selectedSport}
				on:click|preventDefault={() => {
					selectedSport = id;
				}}
			>
				<div class="flex items-center">
					<div>
						<img class="inline-block h-9 w-9 rounded-sm" src={icon} alt={name} />
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium">
							{name}
						</p>
					</div>
				</div>
				<div class="sport-btn-border border-b-2 mt-3 mx-2" />
			</button>
		{/each}
		<div
			class="flex-shrink-0 px-1"
			use:inview
			on:inview_change={({ detail: { inView } }) => {
				lastElementInView = inView;
			}}
		/>
	</div>
	<div class="flex pb-2" class:invisible={lastElementInView}>
		<button
			type="button"
			class="mx-auto rounded-full bg-gray-100 p-1 text-black shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
			on:click|preventDefault={scrollRight}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
			</svg>
		</button>
	</div>
</div>
