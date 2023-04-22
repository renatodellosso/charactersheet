import { ObjectId } from "mongodb";

export class Stat {
    name: string;
    fullName?: string;
    bonuses: { reason: string, value: number }[];

    constructor(name: string, base: number, fullName?: string) {
        this.name = name;
        this.fullName = fullName || name;
        this.bonuses = [
            { reason: "Base", value: base }
        ];
    }
}

export interface Character {
    _id: ObjectId | null,
    idString: string,
    owner: ObjectId | null,

    name: string,
    abilityScores: { [key: string]: Stat }
}