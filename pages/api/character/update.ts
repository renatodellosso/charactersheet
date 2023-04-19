import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Nextauth, { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { doesUserOwnCharacter, emailToID } from "@/lib/db/users";
import { ObjectId, UpdateFilter } from "mongodb";
import { updateCharacter } from "@/lib/db/characters";
import { Character } from "@/lib/characterDefs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if(session) { //Check if we actually got a session
        const userID = await emailToID(session.user?.email!);

        if(userID) {
            const body: {
                characterID: string | ObjectId,
                update: Partial<Character> | UpdateFilter<Character>
            } = req.body;
            
            if(body && body.update && body.characterID) {
                body.characterID = new ObjectId(body.characterID);

                //Clean the _id from the object
                delete body.update._id;

                if(await doesUserOwnCharacter(userID, body.characterID)) {
                    console.log("User updating character... User ID: " + userID + ", body: \n\t" + JSON.stringify(body));
                    updateCharacter(body.characterID, body.update);

                    res.status(200).json({ success: true });
                }
                else res.status(401).json({ success: false, error: "User does not own character" });

            } else res.status(401).json({ success: false, error: "No or invalid body" });

        } else res.status(401).json({ success: false, error: "User not found" });
    } 
    else res.status(401).json({ success: false, error: "Not logged in" });

    res.end();
}