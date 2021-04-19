import { expect } from "chai";
import { convertEnumValToString } from "../src/tools";

enum MyEnum
{
    First,
    Second,
    Third
}

describe( 'Tools', () =>
{
    describe( 'convertEnumValToString', () =>
    {
        it( 'Gets first enum value', () =>
        {
            expect( convertEnumValToString( MyEnum, MyEnum.First ) ).to.equal( "First" );
        } );

        it( 'Gets last enum value', () =>
        {
            expect( convertEnumValToString( MyEnum, MyEnum.Third ) ).to.equal( "Third" );
        } );

        it( 'Returns empty string for non-existent enum value', () =>
        {
            expect( convertEnumValToString( MyEnum, 4 ) ).to.equal( "" );
        } );
    } );
} );