import { timeoutPromise } from "./tools";

const serverUrl = process.env.NODE_ENV === "production" ? "https://ghost-word-server.herokuapp.com" : "http://localhost:3001";
type WordLookupType = "wordsstartingwith" | "wordsendingwith" | "wordscontaining" | "countwordsstartingwith" | "countwordsendingwith" | "countwordscontaining";

export interface IAPI
{
    isWord( testWord: string ): Promise<boolean>;
    getAllWordsContaining( wordPart: string ): Promise<string[]>;
    getAllWordsStartingWith( wordPart: string ): Promise<string[]>;
    getAllWordsEndingWith( wordPart: string ): Promise<string[]>;
    countWordsEndingWith( wordPart: string ): Promise<number>;
}

// Communicate with the ghost-word-server to check if words exist, get list of possible words given the current string, etc.
export class API implements IAPI
{
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

    async isWord( testWord: string ): Promise<boolean>
    {
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


    getAllWordsStartingWith = async ( wordPart: string ): Promise<string[]> =>
    {
        return await this.getWords( wordPart, "wordsstartingwith" ) as string[];
    }

    getAllWordsEndingWith = async ( wordPart: string ): Promise<string[]> =>
    {
        return await this.getWords( wordPart, "wordsendingwith" ) as string[];
    }

    getAllWordsContaining = async ( wordPart: string ): Promise<string[]> =>
    {
        return await this.getWords( wordPart, "wordscontaining" ) as string[];
    }

    countWordsStartingWith = async ( wordPart: string ): Promise<number> =>
    {
        return await this.getWords( wordPart, "countwordsstartingwith" ) as number;
    }

    countWordsEndingWith = async ( wordPart: string ): Promise<number> =>
    {
        return await this.getWords( wordPart, "countwordsendingwith" ) as number;
    }

    countWordsContaining = async ( wordPart: string ): Promise<number> =>
    {
        return await this.getWords( wordPart, "countwordscontaining" ) as number;
    }

    private async getWords( wordPart: string, lookupType: WordLookupType ): Promise<string[] | number>
    {
        try
        {
            const url = `${serverUrl}/${lookupType}/${wordPart}`;
            const response = await window.fetch( url );
            const possibleWordList = await response.json();
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