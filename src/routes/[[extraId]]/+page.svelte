<script lang="ts">
	import type { CustomAlbum, CustomSong } from '$lib/myinterfaces';
	import { shuffle } from '$lib/utils';
	import type { PageData } from './$types';
	import ResolvedApp from './ResolvedApp.svelte';
	import Songs from './Songs.svelte';
	import YtPlayer from './YTPlayer.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	$inspect(data);
	let songs: CustomSong[] = $state.raw([]);
	let goodSongs = $derived(shuffle(songs.filter((e) => e.contentDetails?.duration?.includes('M'))));
	let currentSong: CustomSong | undefined = $state.raw();
	let nextSong = $derived(goodSongs[(goodSongs.indexOf(currentSong) + 1) % goodSongs.length]);

	function scrollToSong(btn: HTMLButtonElement) {
		// console.log('will scorll');

		btn.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
	}

	let player = $state();

	function playNextSong() {
		player.loadVideoById(nextSong.id);
		currentSong = nextSong;
		let currentButton = buttonElements[goodSongs.indexOf(currentSong)];
		currentButton.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
	}

	let buttonElements: HTMLButtonElement[] = $state([]);

	let activePlaylists = $state(new SvelteSet<CustomAlbum>());
	let reversedActivePlaylists = $derived(Array.from(activePlaylists).reverse());
	let playerHidden = $state(true);
</script>

<svelte:boundary>
	<ResolvedApp
		extraPlaylist={data.extraPlaylist}
		playlists={data.playlistsWithVideos}
		bind:songs
		bind:activePlaylists
	/>

	{#snippet pending()}
		<div class="flex flex-1 flex-col items-center justify-center bg-red-100 text-center">
			<div class="py-4 text-8xl">🦖</div>
			<div>loading playlists...</div>
		</div>
	{/snippet}
</svelte:boundary>

<Songs
	songs={goodSongs}
	{player}
	bind:currentSong
	{scrollToSong}
	bind:buttonElements
	bind:playerHidden
/>

<div class="player lg:col-start-1 lg:row-span-2 lg:row-start-1">
	<YtPlayer bind:player {playNextSong} bind:playerHidden />
</div>

<svelte:head>
	<title>{currentSong ? currentSong.snippet?.title + ' -' : ''} ytplayer</title>
</svelte:head>
