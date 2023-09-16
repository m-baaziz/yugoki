<script lang="ts">
	import { mapEntries } from '$lib/MapEntry';
	import SportGrid from './SportList/SportGrid.svelte';
	import SportMap from './SportMap/SportMap.svelte';
	import { SportPicker } from './SportPicker';

	// TODO: search store
</script>

<div>
	<SportPicker />
</div>

<div>
	<SportGrid entries={[mapEntries[0], mapEntries[1]]} />
</div>

<div>
	<SportMap />
</div>

<style>
</style>
