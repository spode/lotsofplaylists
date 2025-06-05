import { youtube_v3 } from "@googleapis/youtube"

export interface CustomSong extends youtube_v3.Schema$Video {
    album: youtube_v3.Schema$Playlist
}

export interface CustomAlbum extends youtube_v3.Schema$Playlist {
    songs: CustomSong[]
}

