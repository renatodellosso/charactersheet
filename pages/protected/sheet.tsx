import SheetHeader from "@/components/sheetHeader";
import { Character, cleanCharacter, cleanCharacters, getCharacter, getCharacters } from "@/lib/db/characters";
import { emailToID } from "@/lib/db/users";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { ChangeEventHandler, FormEvent } from "react";

interface SheetProps {
    session: {
        user: {
            name: string,
            email: string
        }
    },
    character: Character
}

const onChange = (event: FormEvent<HTMLInputElement>) => {
    console.log("Form changed. "+ event.currentTarget.name + ": " + event.currentTarget.value);
}

export default function Sheet(props: SheetProps) {
    if(props.character) {
        return (
            <main className="min-h-screen">
                <form>
                    <SheetHeader character={props.character} onChange={onChange}></SheetHeader>
                </form>
            </main>
        )
    } else {
        return (
            <main className="min-h-screen p-12">
                <h1>We encountered an error. Possible reasons are: <br /></h1>
                <p className="text-xl mt-2 ml-2">-You may not have permissions to view this character</p>
            </main>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const userID = await emailToID(session?.user?.email!);

    if(userID) {
        let character: Character | null = await getCharacter(new ObjectId(context.query.id as string));

        if(character?.owner?.equals(userID)) {
        
            if(character) character = cleanCharacter(character);        

            return {
                props: {
                    session: session,
                    character: character
                }
            }
        }
    }
    
    return {
        props: {
            session: session
        }
    }
}