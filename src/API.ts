const serverUrl = "http://localhost:3001";

export async function checkForWord( testWord: string, minWordLength: number ): Promise<boolean>
{
    if ( testWord.length < minWordLength )
    {
        console.log( 'Word too short, not checking' );
        return false;
    }
    console.log( `Checking for word '${testWord}'...` );
    const response = await window.fetch( `${serverUrl}/isword/${testWord}` );
    const actualResponse = await response.json();
    return actualResponse.isWord;
}

export async function getPossibleWords( wordPart: string, saveToState: ( possibleWordList: string[] ) => void ): Promise<string[]>
{
    const response = await window.fetch( `${serverUrl}/possiblewords/${wordPart}` );
    const possibleWordList = await response.json();
    saveToState( possibleWordList );
    return possibleWordList;
}

export async function getBlacklist(): Promise<string[]>
{
    const response = await window.fetch( `${serverUrl}/blacklist` );
    return await response.json();
}

export async function getWhitelist(): Promise<string[]>
{
    const response = await window.fetch( `${serverUrl}/whitelist` );
    return await response.json();
}