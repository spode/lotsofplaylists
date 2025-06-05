<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let iframe = $state();

	function onPlayerReady(event) {
		// player.loadVideoById('B_eYzdIQ6z4');
	}

	let { player = $bindable(), playNextSong, playerHidden = $bindable() } = $props();

	function onPlayerStateChange(event: YT.OnStateChangeEvent) {
		if (event.data == YT.PlayerState.ENDED) {
			playNextSong();
		}
	}

	onMount(() => {
		player = new YT.Player('ytPlayer', {
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});

		return () => {
			player.destroy();
		};
	});

	let myKey = {};
</script>

{#if myKey && browser}
	<div class="relative h-full w-full">
		<!-- YouTube Player (always present) -->
		<div id="ytPlayer" class="h-full w-full"></div>

		<!-- Overlay Message -->
		{#if playerHidden}
			<div
				class="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900"
			>
				<div class="text-center text-white">
					<div class="mb-4 text-4xl">🎵</div>
					<h3 class="mb-2 text-xl font-semibold">No song loaded</h3>
					<p class="text-gray-300">Choose a song to start your music experience</p>
				</div>
			</div>
		{/if}
	</div>
{/if}

<!-- <svelte:window
	onmessage={(event) => {
		var data = JSON.parse(event.data);
		// console.log('BEANS', data.info);

		// if (event.source === iframe.contentWindow) {
		// 	if (data.event === 'infoDelivery' && data.info && data.info.volume) {
		// 		myVolume = data.info.volume;
		// 	}
		// }
	}}
/> -->

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<style>
	iframe {
		width: 100%;
		height: 100%;
	}
</style>
