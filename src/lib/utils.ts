export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

export function delayed(value, ms = 5) {
    return new Promise((f) => {
        setTimeout(() => f(value), ms * 1000);
    });
}