const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export function getRandomLetter(): string {
    return getRandomElementFromArray(alphabet);
}

export function getRandomElementFromArray(arr: any[] | string) {
    return arr[Math.floor(Math.random() * arr.length)];
}