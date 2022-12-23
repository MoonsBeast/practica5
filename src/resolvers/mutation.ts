import {ObjectId} from "mongo";
import {UserCollection, MessageCollection} from "../db/db.ts";
import {UserSchema,MessageSchema} from "../db/schema.ts";
import { config } from "dotenv"
import * as bcrypt from "bcrypt"
import { createJWT, verifyJWT } from "../lib/jwt.ts"
import { User } from "../types.ts";

export const Mutation = {
    createUser: async(
        _: unknown,
        args: {
            username: string,
            password: string
        },
        ctx
    ): Promise<UserSchema> => {

        const { username, password } = args

        const env = config();

        if (!env?.SECRET) {
            throw Error("Secret is missing")
        }

        if (ctx.lang.trim() === "") {
            throw Error("Languaje is missing")
        }

        const prevUser = await UserCollection.findOne({username})

        if(prevUser){
            throw Error("User already exists")
        }

        const creationDate = new Date().toUTCString()
        const pwd = await bcrypt.hash(password);

        const data: Partial<UserSchema> = {
            username,
            lang: ctx.lang,
            pwd,
            creationDate
        }

        const id = await UserCollection.insertOne(data as UserSchema)

        data._id = id;

        return data as UserSchema
        
    },
    
    sendMessage: async(
        _: unknown,
        args: {
            receiver: string,
            body: string
        },
        ctx
    ): Promise<MessageSchema> => {

        const {receiver, body} = args
        const {auth, lang} = ctx

        const env = config();

        if (!env?.SECRET) {
            throw Error("Secret is missing")
        }
        
        const user = await verifyJWT(auth, env.SECRET) as User
        const userRec = await UserCollection.findOne({ _id: new ObjectId(receiver)})
        const userSen = await UserCollection.findOne({ _id: new ObjectId(user.id) })

        if(!(userRec && userSen)){
            throw new Error("Error authenticating users")
        }

        if(userRec.lang != lang){
            throw new Error("Unmatching languajes")
        }

        const message: Partial<MessageSchema> = {
            sender: userSen._id,
            receiver: userRec._id,
            body,
            time: new Date()
        }

        const id = await MessageCollection.insertOne(message as MessageSchema)

        message._id = id;

        return message as MessageSchema
    },

    deleteUser: async(
        _: unknown,
        args: {},
        ctx
    ): Promise<UserSchema> => {
        
        const { auth } = ctx

        const env = config();

        if (!env?.SECRET) {
            throw Error("Secret is missing")
        }

        const user = await verifyJWT(auth, env.SECRET) as User

        await UserCollection.deleteOne({_id: new ObjectId(user.id)})

        return { ...user, _id: new ObjectId(user.id) } as UserSchema
    }
}