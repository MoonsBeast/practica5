import { MongoClient } from "mongo";
import { config } from "dotenv"
import { UserSchema, MessageSchema } from "./schema.ts"

const env = config();

if (!env.URL_MONGO) {
    console.error("No enviroment variable: URL_MONGO")
    throw Error("No enviroment variable: URL_MONGO")
}

const client = new MongoClient();
await client.connect(env.URL_MONGO)
const db = client.database("chat")
console.info("MongoDB connected!")

export const UserCollection = db.collection<UserSchema>("Users")
export const MessageCollection = db.collection<MessageSchema>("Messages")