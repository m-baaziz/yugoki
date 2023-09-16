<script lang="ts">
	import { PUBLIC_MAP_API_TOKEN } from '$env/static/public';
	import { Map } from 'mapbox-gl';
	import { onMount, onDestroy } from 'svelte';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let map: Map;
	let mapContainer: HTMLElement;
	const initLng = -71.224518;
	const initLat = 42.213995;
	const initZoom = 9;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			accessToken: PUBLIC_MAP_API_TOKEN,
			style: `mapbox://styles/mapbox/outdoors-v11`,
			center: [initLng, initLat],
			zoom: initZoom
		});
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="relative h-full w-full" bind:this={mapContainer} />
