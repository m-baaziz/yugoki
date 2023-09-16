<script lang="ts">
	export let value: number;
	const maxRating = 5;
</script>

<div class="flex items-center">
	{#each [...Array(maxRating).keys()] as index}
		{#if value >= index + 1}
			<svg
				class="text-yellow-400 h-5 w-5 flex-shrink-0"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else if value <= index}
			<svg
				class="text-gray-200 h-5 w-5 flex-shrink-0"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else}
			<svg
				class="text-gray-200 h-5 w-5 flex-shrink-0"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="Gradient" x1="0" x2="1" y1="0" y2="0">
						<stop offset="0%" stop-color="rgb(250 204 21)" />
						<stop offset={`${15 + 100 * (value - index)}%`} stop-color="currentcolor" />
					</linearGradient>
				</defs>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
					clip-rule="evenodd"
					fill="url(#Gradient)"
				/>
			</svg>
		{/if}
	{/each}
</div>
