const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export function chooseRandomLetter(): string
{
    return getRandomElementFromArray( alphabet );
}

export function getRandomElementFromArray( arr: any[] | string )
{
    return arr[Math.floor( Math.random() * arr.length )];
}

// Wait for a promise to either resolve or reject, will also reject after specified timeout has elapsed.
export function timeoutPromise( ms: number, promise: Promise<any> )
{
    return new Promise( ( resolve, reject ) =>
    {
        const timeoutId = setTimeout( () =>
        {
            reject( new Error( "promise timeout" ) )
        }, ms );
        promise.then(
            ( res ) =>
            {
                clearTimeout( timeoutId );
                resolve( res );
            },
            ( err ) =>
            {
                clearTimeout( timeoutId );
                reject( err );
            }
        );
    } )
}

export function convertEnumValToString<T>( enumClass: T, enumKey: number ): string
{
    for ( const enumMember in enumClass )
    {
        const index = parseInt( enumMember, 10 );
        if ( index === enumKey )
            return enumClass[enumMember] as unknown as string;
    }
    return "";
}