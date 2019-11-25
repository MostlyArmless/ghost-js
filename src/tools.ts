const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export function getRandomLetter(): string
{
    return getRandomElementFromArray( alphabet );
}

export function getRandomElementFromArray( arr: any[] | string )
{
    return arr[Math.floor( Math.random() * arr.length )];
}

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