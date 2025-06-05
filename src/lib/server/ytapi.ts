import { MY_API_KEY } from "$env/static/private";
import { youtube } from "@googleapis/youtube";
import type { youtube_v3 } from "@googleapis/youtube";


const youtubeAPI = youtube({
    version: 'v3',
    auth: MY_API_KEY
});

// https://developers.google.com/youtube/v3/docs/playlists/list
// PLAYLISTS (from ID)
export async function getPlaylistDetails(playlistId: string) {

    try {
        const playlistParams: youtube_v3.Params$Resource$Playlists$List = {
            part: ['snippet'],
            id: [playlistId]
        }

        //Quota impact: A call to this method has a quota cost of 1 unit.
        console.log("playlists.list: using quota 1");
        const playlistThing = await youtubeAPI.playlists.list(playlistParams);

        return playlistThing.data
    } catch (error) {
        console.error('Error getting playlist details:', error);
    }
}

// PLAYLISTITEMS

export async function getPlaylistItems(playlistId: string | undefined) {

    let items = []
    let pageToken: string | null | undefined = ""
    do {
        const playlistItemsParams: youtube_v3.Params$Resource$Playlistitems$List = {
            part: ['snippet'],
            playlistId,
            maxResults: 50,
            pageToken
        }
        //Quota impact: A call to this method has a quota cost of 1 unit.
        console.log("playlistitems.list: using quota 1");
        const playlistItemsThing = await youtubeAPI.playlistItems.list(playlistItemsParams)

        items.push(playlistItemsThing.data.items) // Combine the current page results with the previous ones

        pageToken = playlistItemsThing.data.nextPageToken
    } while (pageToken);
    return items
}

// VIDEOS
export async function getVideosFromItems(ids: string[]) {

    let videos = []
    let pageToken: string | null | undefined = ""
    do {
        const videosParams: youtube_v3.Params$Resource$Videos$List = {
            part: ['snippet', 'contentDetails'],
            id: [ids.join()],
            maxResults: 50,
            pageToken
        }
        //Quota impact: A call to this method has a quota cost of 1 unit.
        console.log("videos.list: using quota 1");
        const res = await youtubeAPI.videos.list(videosParams);
        videos.push(res.data.items) // Combine the current page results with the previous ones

        if (pageToken) {
            pageToken = res.data.nextPageToken
        }
    } while (pageToken);
    return videos.flat()
}

// PLAYLISTS (from CHANNEL)
export async function getChannelPlaylists(channelId: string) {

    let allPlaylists: youtube_v3.Schema$Playlist[] = []
    let pageToken: string | null | undefined = ""
    do {

        const playlistsParams: youtube_v3.Params$Resource$Playlists$List = {
            part: ['snippet'],
            channelId,
            maxResults: 50,
            pageToken
        }


        //Quota impact: A call to this method has a quota cost of 1 unit.
        console.log("playlists.list: using quota 1");
        const res = await youtubeAPI.playlists.list(playlistsParams);

        const items: youtube_v3.Schema$Playlist[] | undefined = res.data.items

        if (items) {
            allPlaylists = [...allPlaylists, ...items] // Combine the current page results with the previous ones
        }
        pageToken = res.data.nextPageToken
    } while (pageToken);
    return allPlaylists
}

// https://developers.google.com/youtube/v3/docs/playlists/list
export async function getChannelPlaylistsWithItems(channelId) {
    // Step 1: Get the channel playlists
    const channelPlaylists = await getChannelPlaylists(channelId);

    // Step 2: Create an array of promises to fetch playlist items for each playlist, with a delay
    const playlistItemsPromises = channelPlaylists.map(async (playlist) => {

        // Fetch the playlist items after the delay
        const items = await getPlaylistItems(playlist.id);

        let videos = await Promise.all(items.map(async element => {
            const videoIds = element.map(item => item.snippet.resourceId.videoId)

            return await getVideosFromItems(videoIds);
        }))

        videos = videos.flat()

        // Attach the playlist to each item
        const itemsWithPlaylist = videos.map(item => ({
            ...item, // spread the item properties
            album: playlist, // add the playlist object to each item
        }));

        // Return the result with the playlist and items
        return {
            ...playlist,
            songs: itemsWithPlaylist,
        };
    });

    return await Promise.all(playlistItemsPromises);
}

// https://developers.google.com/youtube/v3/docs/playlists/list
export async function getPlaylistWithVideos(playlistId: string) {

    const playlistDetails = await getPlaylistDetails(playlistId);

    const items = await getPlaylistItems(playlistId);

    let videos = await Promise.all(items.map(async element => {
        const videoIds = element.map(item => item.snippet.resourceId.videoId)

        return await getVideosFromItems(videoIds);
    }))

    videos = videos.flat()

    const itemsWithPlaylist = videos.map(item => ({
        ...item,
        album: playlistDetails?.items[0],
    }));

    return {
        ...playlistDetails?.items[0],
        songs: itemsWithPlaylist
    }
}