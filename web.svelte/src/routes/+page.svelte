<script lang="ts">
	import { mapEntries } from '$lib/MapEntry';
	import SportGrid from './SportList/SportGrid.svelte';
	import SportMap from './SportMap/SportMap.svelte';
	import { SportPicker } from './SportPicker';

	// TODO: search store
</script>

<div class="h-full flex flex-col">
	<SportPicker />
	<SportGrid entries={[mapEntries[0], mapEntries[1]]} />
	<div class="flex-grow">
		<SportMap />
	</div>
</div>
