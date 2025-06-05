<script lang="ts">
	let {
		songs,
		player,
		currentSong = $bindable(),
		scrollToSong,
		buttonElements = $bindable(),
		playerHidden = $bindable()
	} = $props();

	import { IsInViewport } from 'runed';

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);
</script>

<div class="songs flex flex-1 flex-col overflow-auto">
	<h2 class="font-bold">songs</h2>
	<div style="scrollbar-gutter: stable;" class="flex flex-col overflow-auto">
		{#each songs as song, index}
			<button
				bind:this={buttonElements[index]}
				class="song cursor-pointer text-left {currentSong == song
					? 'bg-btn/40 text-btn-text'
					: ''}  "
				onclick={() => {
					player.loadVideoById(song.id);
					scrollToSong(buttonElements[index]);
					currentSong = song;
					playerHidden = false;
				}}
			>
				<div class="songInfo flex items-center text-shadow-md">
					<img
						class="songThumb size-[100px] object-cover"
						src={song.snippet?.thumbnails?.medium?.url}
						alt=""
					/>
					<div class="songTextInfo p-2">
						<div class="text-xl">{song.snippet.title}</div>
						<div class="text-xs">
							{song.album.snippet.title.replace(/(\(.*Soundtrack.*\))/i, '')}
						</div>
						<div class="text-xs">
							#{index + 1} • {song.contentDetails?.duration
								.replace('PT', '')
								.replace('M', 'm ')
								.toLowerCase()}
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
