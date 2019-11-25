const serverUrl = "https://ghost-word-server.herokuapp.com";

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
        try
        {
            const response = await window.fetch( `${serverUrl}/isword/${testWord}` );
            const actualResponse = await response.json();
            return actualResponse.isWord;
        }
        catch ( error )
        {
            console.error( error );
            return false;
        }
    }

    async getPossibleWords( wordPart: string, saveToState: ( possibleWordList: string[] ) => void ): Promise<string[]>
    {
        try
        {
            const response = await window.fetch( `${serverUrl}/possiblewords/${wordPart}` );
            const possibleWordList = await response.json();
            saveToState( possibleWordList );
            return possibleWordList;
        }
        catch ( error )
        {
            console.error( error );
            return [];
        }
    }

    async getBlacklist(): Promise<string[]>
    {
        try
        {
            const response = await window.fetch( `${serverUrl}/blacklist` );
            return await response.json();
        }
        catch ( error )
        {
            console.error( error );
            return [];
        }
    }

    async getWhitelist(): Promise<string[]>
    {
        try
        {
            const response = await window.fetch( `${serverUrl}/whitelist` );
            return await response.json();
        }
        catch ( error )
        {
            console.error( error );
            return [];
        }
    }

    async blacklistWord( word: string ): Promise<void>
    {
        try
        {
            const response = await window.fetch( `${serverUrl}/blacklist/${word}` );
            console.log( response );
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    async whitelistWord( word: string ): Promise<void>
    {
        try
        {
            const data = await window.fetch( `${serverUrl}/whitelist/${word}` );
            console.log( JSON.stringify( data ) ); // JSON-string from `response.json()` call
        }
        catch ( error )
        {
            console.error( error );
        }
    }
}