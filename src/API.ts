const serverUrl = "https://ghost-word-server.herokuapp.com/";

export class API
{
    constructor()
    {

    }

    async checkForWord( testWord: string, minWordLength: number ): Promise<boolean>
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

    async getPossibleWords( wordPart: string, saveToState: ( possibleWordList: string[] ) => void ): Promise<string[]>
    {
        const response = await window.fetch( `${serverUrl}/possiblewords/${wordPart}` );
        const possibleWordList = await response.json();
        saveToState( possibleWordList );
        return possibleWordList;
    }

    async getBlacklist(): Promise<string[]>
    {
        const response = await window.fetch( `${serverUrl}/blacklist` );
        return await response.json();
    }

    async getWhitelist(): Promise<string[]>
    {
        const response = await window.fetch( `${serverUrl}/whitelist` );
        return await response.json();
    }

    async blacklistWord( word: string ): Promise<void>
    {
        const response = await window.fetch( `${serverUrl}/blacklist/${word}` );
        console.log( response );
    }

    async whitelistWord( word: string ): Promise<void>
    {
        try
        {
            const data = await this.postData( `${serverUrl}/whitelist/${word}`, { word: word } );
            console.log( JSON.stringify( data ) ); // JSON-string from `response.json()` call
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    private postData = async ( url = '', data = {} ) =>
    {
        // Default options are marked with *
        const response = await fetch( url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify( data ) // body data type must match "Content-Type" header
        } );
        return await response.json(); // parses JSON response into native JavaScript objects
    }
}