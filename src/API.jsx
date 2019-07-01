export async function checkForWord(testWord) {
    if (testWord.length < this.state.gameSettings.minimumWordLength.value) {
        console.log('Word too short, not checking');
        return false;
    }
    console.log(`Checking for word '${testWord}'...`);
    const response = await window.fetch(`http://localhost:3001/isword/${testWord}`);
    const actualResponse = await response.json();
    return actualResponse.isWord;
}

export async function getPossibleWords(wordPart) {
    const response = await window.fetch(`http://localhost:3001/possiblewords/${wordPart}`);
    const possibleWordList = await response.json();
    console.log(`Possible words: ${possibleWordList}`);
    return possibleWordList;
}