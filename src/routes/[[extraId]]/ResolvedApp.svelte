<script lang="ts">
	import type { CustomAlbum } from '$lib/myinterfaces';
	import { shuffle } from '$lib/utils';
	import { setTheme } from 'mode-watcher';
	import { fade, fly } from 'svelte/transition';

	let { playlists, songs = $bindable(), activePlaylists = $bindable() } = $props();

	let channelPlaylists: CustomAlbum[] = $derived(await playlists);

	let goodPlaylists = $derived(
		channelPlaylists.filter(
			(e) =>
				!e.snippet?.title?.includes('Rabbids') &&
				!e.snippet?.title?.includes('Unravel') &&
				!e.snippet?.title?.includes('Dusk') &&
				!activePlaylists.has(e)
		)
	);
</script>

<div class="playlists flex flex-1 flex-row overflow-auto lg:gap-2">
	<div class="flex flex-1 flex-col overflow-y-auto">
		<h2 class="text-center font-bold">playlists</h2>

		<div
			style="scrollbar-gutter: stable;"
			class="flex flex-wrap justify-around gap-2 overflow-auto"
		>
			{#each goodPlaylists as playlist}
				<button
					class="bg-btn/50 text-btn-text line-clamp-1 flex max-w-[100px] flex-auto cursor-pointer flex-col rounded lg:max-w-[120px]"
					onclick={() => {
						if (!activePlaylists.has(playlist)) {
							activePlaylists.add(playlist);
							songs = [...songs, ...playlist.songs];
						} else {
							console.log('already has, remoinvg');
							activePlaylists.delete(playlist);
							songs = songs.filter((e) => e.album.snippet.title != playlist.snippet.title);
						}
					}}
				>
					<img
						class="aspect-square object-cover"
						src={playlist.snippet?.thumbnails?.medium?.url}
						alt=""
					/>

					<div class=" flex-1 items-center justify-center p-1 text-xs">
						<p class="line-clamp-2 h-8 text-shadow-md">
							{playlist.snippet.title
								.replace(/(\(.*Soundtrack.*\))/i, '')
								.replace(/Original.Soundtrack/i, '')
								.replace(/Soundtrack/i, '')
								.trim()}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<div class="border-btn/80 mx-2 my-1 rounded-2xl border-4 border-l"></div>

	<div class="flex flex-1 flex-col overflow-auto">
		<h2 class="text-center font-bold">activeplaylists</h2>
		<div
			style="scrollbar-gutter: stable;"
			class="flex flex-wrap justify-around gap-2 overflow-auto"
		>
			{#each activePlaylists as playlist}
				<button
					in:fade
					class="bg-btn/50 text-btn-text flex max-w-[100px] flex-auto cursor-pointer flex-col rounded lg:max-w-[120px]"
					onclick={() => {
						if (!activePlaylists.has(playlist)) {
							activePlaylists.add(playlist);
							songs = [...songs, ...playlist.songs];
						} else {
							console.log('already has, remoinvg');
							activePlaylists.delete(playlist);
							songs = songs.filter((e) => e.album.snippet.title != playlist.snippet.title);
						}
					}}
				>
					<img
						class="aspect-square rounded object-cover"
						src={playlist.snippet?.thumbnails?.medium?.url}
						alt=""
					/>
					<div class=" flex-1 items-center justify-center p-1 text-xs">
						<p class="line-clamp-2 h-8 text-shadow-md">
							{playlist.snippet.title
								.replace(/(\(.*Soundtrack.*\))/i, '')
								.replace(/Original.Soundtrack/i, '')
								.replace(/Soundtrack/i, '')
								.trim()}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
