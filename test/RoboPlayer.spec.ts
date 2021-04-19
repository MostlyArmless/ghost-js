import { RoboPlayer } from "../src/RoboPlayer";
import { expect } from 'chai';
import { IAPI } from "../src/API";
import { eGameActions } from "../src/constants";

class MockApi implements IAPI
{
    dictionary: string[];
    constructor( dictionary: string[] )
    {
        this.dictionary = dictionary;
    }

    isWord = async ( testWord: string ): Promise<boolean> =>
    {
        return this.dictionary.includes( testWord );
    }

    getAllWordsContaining = async ( wordPart: string ): Promise<string[]> =>
    {
        return this.dictionary.filter( word => word.includes( wordPart ) );
    }

    getAllWordsStartingWith = async ( wordPart: string ): Promise<string[]> =>
    {
        return this.dictionary.filter( word => word.startsWith( wordPart ) );
    }

    getAllWordsEndingWith = async ( wordPart: string ): Promise<string[]> =>
    {
        return this.dictionary.filter( word => word.endsWith( wordPart ) );
    }

    countWordsEndingWith = async ( wordPart: string ): Promise<number> =>
    {
        return ( await this.getAllWordsEndingWith( wordPart ) ).length;
    }
}

describe( 'RoboPlayer', () =>
{
    let roboPlayer: RoboPlayer;
    let mockApi: IAPI;
    let gameString: string;

    beforeEach( () =>
    {
        mockApi = new MockApi( ['ghost', 'most', 'ghana'] );
        roboPlayer = new RoboPlayer( mockApi, "Hard", 2 );
        roboPlayer.setTargetWordForUnitTestPurposes( 'ghost' );
    } );

    it( 'Calls BS when no word can be made from gameString in Append Only mode', async () =>
    {
        gameString = 'badstringasdf';
        expect( await roboPlayer.decideNextMove( gameString, "Append Only" ) ).to.equal( eGameActions.CallBullshit );
    } );

    it( 'Calls BS when no word can be made from gameString in Prepend Only mode', async () =>
    {
        gameString = 'badstringasdf';
        expect( await roboPlayer.decideNextMove( gameString, "Prepend Only" ) ).to.equal( eGameActions.CallBullshit );
    } );

    it( 'Decides to append letter when a valid word can be made by appending', async () =>
    {
        gameString = 'gho';
        expect( await roboPlayer.decideNextMove( gameString, "Append Only" ) ).to.equal( eGameActions.AppendLetter );
    } );

    it( 'Decides to prepend letter when a valid word can be made by prepending', async () =>
    {
        gameString = 'ost';
        expect( await roboPlayer.decideNextMove( gameString, "Prepend Only" ) ).to.equal( eGameActions.PrependLetter );
    } );

    it( 'Chooses correct letter to append', async () =>
    {
        gameString = 'ghos';
        expect( await roboPlayer.chooseLetterToAppend( gameString ) ).to.equal( 't' );
    } );

    it( 'Chooses correct letter to prepend', async () =>
    {
        gameString = 'host';
        expect( await roboPlayer.chooseLetterToPrepend( gameString ) ).to.equal( 'g' );
    } );

    it( 'Appends a random letter when gameString is empty', async () =>
    {
        gameString = '';
        expect( await roboPlayer.chooseLetterToAppend( gameString ) ).to.match( /[a-z]{1}/g );
    } );

    it( 'Prepends a random letter when gameString is empty', async () =>
    {
        gameString = '';
        expect( await roboPlayer.chooseLetterToPrepend( gameString ) ).to.match( /[a-z]{1}/g );
    } );
} );