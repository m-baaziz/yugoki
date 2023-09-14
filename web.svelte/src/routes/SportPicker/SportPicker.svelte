<script lang="ts">
	import type { Sport } from '$lib/Sport';

	const sports: Sport[] = [
		{
			name: 'football',
			icon: '/icons/80/football.png'
		},
		{
			name: 'basketball',
			icon: '/icons/80/basketball.png'
		}
	];
</script>

<div class="mx-auto flex w-full items-center justify-between gap-x-6 p-6">
	<div class="flex-1" />
	{#each sports as { name, icon } (name)}
		<button class="group block flex-shrink-0">
			<div class="flex items-center">
				<div>
					<img class="inline-block h-9 w-9 rounded-full" src={icon} alt={name} />
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{name}</p>
				</div>
			</div>
		</button>
	{/each}
	<div class="flex-1" />
</div>
