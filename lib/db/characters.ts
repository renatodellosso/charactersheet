import { Character, Stat } from '../characterDefs';
import { characters, users } from './db';
import { ObjectId, UpdateFilter } from 'mongodb';

function initCharacter(owner: ObjectId): Character {
    const _id = new ObjectId();

    return { 
        _id: _id, 
        idString: _id.toString(), 
        owner: owner, 
        name: "New Character",
        abilityScores: {
            ["Str"]: new Stat("Str", 10),
            ["Dex"]: new Stat("Dex", 10),
            ["Con"]: new Stat("Con", 10),
            ["Int"]: new Stat("Int", 10),
            ["Wis"]: new Stat("Wis", 10),
            ["Cha"]: new Stat("Cha", 10),
        }
    }
} 

export async function newCharacter(owner: ObjectId): Promise<ObjectId> {
    const character = (await characters.insertOne(initCharacter(owner))).insertedId;

    await users.updateOne({ _id: owner }, { $push: { characters: character } })

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
    character.idString = character._id!.toString();
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

export async function updateCharacter(characterID: ObjectId, update: Partial<Character> | UpdateFilter<Character>) {
    characters.updateOne({ _id: characterID }, update);
}