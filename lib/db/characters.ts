import { characters, users } from './db';
import { Document, ObjectId } from 'mongodb';

export interface Character extends Document {
    _id: ObjectId | null,
    idString: string,
    owner: ObjectId | null,
    name: string,
}

export async function newCharacter(owner: ObjectId): Promise<ObjectId> {
    const _id = new ObjectId();
    const character = (await characters.insertOne({ _id: _id, idString: _id.toString(), owner: owner, name: "New Character" })).insertedId;

    users.updateOne({ _id: owner }, { $push: { characters: character } })

    return character!;
}

export async function getCharacter(id: ObjectId): Promise<Character | null> {
    const character = await characters.findOne({ _id: id });

    return character;
}

export async function getCharacters(owner: ObjectId): Promise<Character[]> {
    const user = await users.findOne({ _id: owner });

    if(user) {
        const characterIDs = user?.characters;
        let characters: Character[] = [];

        const promises = characterIDs.map(async (id) => {
            const character = await getCharacter(id);
            if(character) {
                characters.push(character);
            }
        });

        await Promise.all(promises);
        return characters;
    }

    return [];
}

export function cleanCharacter(character: Character): Character {
    character._id = null;
    character.owner = null;

    return character;
}

export function cleanCharacters(characters: Character[]): Character[] {
    //Clean ObjectIds from characters. They are not serializable.
    //However, we do have idString in there, so we can use that to link to the sheet
    characters.forEach(cleanCharacter);

    return characters;
}