import type { CustomAlbum } from "$lib/myinterfaces";



const db = new Map<string, CustomAlbum[]>();
export function getDbAlbums() {
    return db.get("albums")
}

export function setDbAlbums(albums: CustomAlbum[]) {
    db.set("albums", albums)
}

