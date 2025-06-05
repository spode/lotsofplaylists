import { CHANNELS } from '$env/static/private';
import { getChannelPlaylists, getPlaylistWithVideos } from '$lib/server/ytapi';
import type { youtube_v3 } from '@googleapis/youtube';
import type { PageServerLoad } from './$types';

const channelIds = CHANNELS.split(",")

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


let timestamp = Date.now()

const myMap = new Map()

export const load = (async ({ params }) => {

    let dbThing = myMap.get("playlists")

    let extraPlaylistId = params.extraId ?? "PL4iv3Q3xc0skeScJ7XEZoK73INblR0mQA"

    const extraPlaylist = getPlaylistWithVideos(extraPlaylistId);

    if (!dbThing) {

        // Step 1: Fetch playlists for all channels
        let channelPlaylists = await fetchChannelPlaylists(channelIds);

        // Step 2: Fetch videos for all the playlists
        let playlistsWithVideos = fetchPlaylistsWithVideos(channelPlaylists);

        myMap.set("playlists", playlistsWithVideos)

    }

    dbThing = myMap.get("playlists")
    let combined = dbThing.then(async e => {
        return [await extraPlaylist, ...e]
    })

    return { extraPlaylist, playlistsWithVideos: combined, combined };
}) satisfies PageServerLoad;