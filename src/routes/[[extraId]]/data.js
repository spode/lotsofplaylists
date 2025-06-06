const myMap = new Map()

export function setData(data) {
    myMap.set("playlists", data)
}

export function getData() {
    return myMap.get("playlists")
}