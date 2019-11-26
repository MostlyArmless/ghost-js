import { timeoutPromise } from "./tools";

const serverUrl = "https://ghost-word-server.herokuapp.com";

export class API
{
    constructor()
    {
    }

    async pingServer(): Promise<boolean>
    {
        try
        {
            // Wait up to 10 seconds for the Heroku-hosted ghost-word-server to respond.
            const response = await timeoutPromise( 10000, window.fetch( `${serverUrl}/` ) ) as Response;

            const res = await response.json();
            return res === "Server online";
        }
        catch ( error )
        {
            console.error( error );
            return false;
        }
    }

    async checkForWord( testWord: string, minWordLength: number ): Promise<boolean>
    {
        if ( testWord.length < minWordLength )
        {
            return false;
        }

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

    async clearBlacklist(): Promise<void>
    {
        try
        {
            const data = await window.fetch( `${serverUrl}/clearBlacklist/` );
            console.log( JSON.stringify( data ) );
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    async clearWhitelist(): Promise<void>
    {
        try
        {
            const data = await window.fetch( `${serverUrl}/clearWhitelist/` );
            console.log( JSON.stringify( data ) );
        }
        catch ( error )
        {
            console.error( error );
        }
    }
}