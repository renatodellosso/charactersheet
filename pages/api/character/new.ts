import { newCharacter } from "@/lib/db/characters";
import { emailToID } from "@/lib/db/users";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if(session) { //Check if we actually got a session
        const userID = await emailToID(session.user?.email!);
        console.log("User creating a new character... User ID: " + userID);
        if(userID) {
            const character = await newCharacter(userID);
            res.status(200).json({ Character: character });
        } else {
            res.status(401).json({ error: "User not found" });
        }
    } else {
        res.status(401).json({ error: "Not logged in" });
    }

    res.end();
}