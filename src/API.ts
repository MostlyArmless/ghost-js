const serverUrl = "http://localhost:3001";

export async function checkForWord(testWord: string, minimumWordLength: number) {
    if (testWord.length < minimumWordLength) {
        console.log('Word too short, not checking');
        return false;
    }
    console.log(`Checking for word '${testWord}'...`);
    const response = await window.fetch(`${serverUrl}/isword/${testWord}`);
    const actualResponse = await response.json();
    return actualResponse.isWord;
}

export async function getPossibleWords(wordPart: string) {
    const response = await window.fetch(`${serverUrl}/possiblewords/${wordPart}`);
    const possibleWordList = await response.json();
    console.log(`Possible words: ${possibleWordList}`);
    return possibleWordList;
}