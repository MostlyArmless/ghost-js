import { Button } from "./Button"

interface HelpPageProps
{
    handleBack(): void;
}

export function HelpPage( props: HelpPageProps )
{
    return (
        <>
            <h2>Help Page</h2>
            <Button
                onClick={ props.handleBack }
                text="Back"
            />

            <p>
                Ghost is a word game for 2 or more players. Players take turns adding a letter to the end of the same string. The first player forced to spell a real word loses and ends the game!
            </p>
            <p>
                However, you must always be working towards a real word. If the letter you've just added makes it impossible to create a word from the string, and the next player realizes it, they can call BS on you and you will also lose.
            </p>
            <p>
                If a player A calls Bullshit on player B, then player B must be able to think of a real word that can be made from the current string. If they produce a real word, then player A is out. If they can't produce a real word, then player B is out.
            </p>
        </>
    );
}