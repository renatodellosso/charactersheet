import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { User } from "./users";
import { Character } from "../characterDefs";

let client = new MongoClient(process.env.MONGODB_URI!);

let database: Db = client.db(process.env.DB_NAME!);
export default database;

export const users: Collection<User> = database.collection<User>("users");
export const characters: Collection<Character> = database.collection<Character>("characters");