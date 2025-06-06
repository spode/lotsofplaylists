import { json } from '@sveltejs/kit';
import * as db from "$lib/data"

import { getChannelPlaylists, getPlaylistWithVideos } from '$lib/server/ytapi';
import { youtube_v3 } from '@googleapis/youtube';

// Fetch all playlists for the given channel IDs
const fetchChannelPlaylists = async (channelIds: string[]) => {
    const playlistsPromises = channelIds.map(getChannelPlaylists);
    const channelPlaylists = await Promise.all(playlistsPromises).then(e => e.flat());

    return channelPlaylists
    // Flatten the result into a single array of playlists
    // return channelPlaylists.flat();
};

// Fetch all videos for each playlist
const fetchPlaylistsWithVideos = async (playlists: youtube_v3.Schema$Playlist[]) => {
    const playlistVideosPromises = playlists.map(playlist => getPlaylistWithVideos(playlist.id));
    return Promise.all(playlistVideosPromises);
    // return playlistVideosPromises;
};

export async function GET() {

    let data = db.getData()

    if (!data) {

        // Step 1: Fetch playlists for all channels
        let channelPlaylists = await fetchChannelPlaylists(channelIds);

        // Step 2: Fetch videos for all the playlists
        let playlistsWithVideos = fetchPlaylistsWithVideos(channelPlaylists);

        db.setData(playlistsWithVideos)

    }

    data = db.getData();

    // const number = Math.floor(Math.random() * 6) + 1;

    // return json(number);
}


