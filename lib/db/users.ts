import { Document, ObjectId, WithId } from "mongodb";
import { users } from "./db";

export interface User extends Document {
    _id: ObjectId,
    name: string,
    email: string,
    image: string,
    characters: ObjectId[]
}

export async function getUser(_id: ObjectId): Promise<WithId<User> | null> {
    return users.findOne({_id: _id});
}

export async function emailToID(email: string): Promise<ObjectId | undefined> {
    return users.findOne({ email: email }).then((user) => {
        return user?._id;
    })
}

export async function getUserByEmail(email: string): Promise<WithId<User> | null> {
    return emailToID(email).then((id) => {
        return getUser(id!);
    })
}

export async function doesUserOwnCharacter(owner: ObjectId, character: ObjectId): Promise<boolean> {
    const user = await getUser(owner);

    return user?.characters.some(c => c.equals(character)) ?? false;
}