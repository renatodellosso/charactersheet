import { ObjectId } from "mongodb";

export class Stat {
    name: string;
    fullName?: string;
    bonuses: {
        _id: string,
        reason: string,
        value: number,
        nameEditable: boolean,
        valueEditable: boolean
    }[];

    constructor(name: string, base: number, fullName?: string) {
        this.name = name;
        this.fullName = fullName || name;
        this.bonuses = [
            { _id: new ObjectId().toString(), reason: "Base", value: base, nameEditable: false, valueEditable: true }
        ];
    }
}

export interface Character {
    _id: ObjectId | null,
    idString: string,
    owner: ObjectId | null,
    name: string,
    abilityScores: {
        str: Stat,
        dex: Stat,
        con: Stat,
        int: Stat,
        wis: Stat,
        cha: Stat,
        [key: string]: Stat
    },
    race: string,
    classes: string
}