import SheetHeader from "@/components/tabs/sheetHeader";
import {     cleanCharacter, cleanCharacters, getCharacter, getCharacters } from "@/lib/db/characters";
import { emailToID } from "@/lib/db/users";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { ChangeEventHandler, FormEvent, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import Router from "next/router";
import { Character } from "@/lib/characterDefs";
import MainTab from "@/components/tabs/mainTab";
import { Popup, PopupProps } from "@/components/popup";
import { update } from "@/lib/clientUtil";

enum Tab {
    Main = "main"
}

interface SheetProps {
    session: {
        user: {
            name: string,
            email: string
        }
    },
    character: Character,
    tab: Tab
}

const onChange = async (event: FormEvent<HTMLInputElement>) => {
    console.log("Form changed. "+ event.currentTarget.name + ": " + event.currentTarget.value);

    event.preventDefault();

    const updateObj = {
        $set: Object()
    }

    updateObj.$set[event.currentTarget.name] = event.currentTarget.value;
    update(updateObj);
}

const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
}

export default function Sheet(props: SheetProps) {
    const [popup, setPopup] = useState<PopupProps>({
        open: false,
    });
    
    if(props.character) {
        return (
            <main className="min-h-screen">
                <form onSubmit={onSubmit}>
                    <SheetHeader character={props.character} onChange={onChange}></SheetHeader>
                    {
                        props.tab == Tab.Main ? <MainTab character={props.character} setPopup={setPopup}></MainTab> : <></>
                    }
                    { popup.open && 
                        <Popup toggle={() => setPopup({ open: false })} open={popup.open} title={popup.title}>
                            { popup.getChildren ? popup.getChildren(props.character, popup.arg ? popup.arg : "") : <></> }
                        </Popup>
                    } 
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
    const session = await getServerSession(context.req, context.res, authOptions);
    const userID = await emailToID(session?.user?.email!);

    console.log("Generating server side props...");

    if(userID) {
        let character: Character | null = await getCharacter(new ObjectId(context.query.id as string));

        if(character?.owner?.equals(userID)) {
        
            if(character) character = cleanCharacter(character);        

            let tab = Tab.Main;
            if(context.query.tab) tab = context.query.tab as Tab;

            return {
                props: {
                    session: session,
                    character: character,
                    tab: tab
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