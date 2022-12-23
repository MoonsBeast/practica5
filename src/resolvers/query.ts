import {ObjectId} from "mongo";
import { MessageCollection, UserCollection } from "../db/db.ts";
import { MessageSchema, UserSchema } from "../db/schema.ts";
import * as bcrypt from "bcrypt"
import { User } from "../types.ts";
import { config } from "dotenv"
import { createJWT, verifyJWT } from "../lib/jwt.ts";


export const Query = {
    getMessages: async(
        _: unknown,
        args: {
            page: number,
            perPage: number
        },
        ctx
    ): Promise<MessageSchema[]> => {

        const {page, perPage} = args

        if(page < 0){
            throw Error("Page must be 0 or greater")
        }

        if (perPage < 10 || perPage > 200) {
            throw Error("perPage must be between 10 and 200")
        }

        const env = config();

        if(!env?.SECRET){
            throw Error("Secret is missing")
        }

        if (ctx?.auth.trim() === ""){
            throw Error("Authentication is missing")
        }

        const user = await verifyJWT(ctx.auth, env.SECRET) as User

        return await MessageCollection.find({receiver: new ObjectId(user.id)}).skip(page*perPage).limit(perPage).toArray()

    },

    login: async (
        _: unknown,
        args: {
            username: string,
            password: string
        },
        ctx
    ): Promise<string> => {

        const { username, password } = args

        const env = config();

        if (!env?.SECRET) {
            throw Error("Secret is missing")
        }

        if (ctx?.lang.trim() === "") {
            throw Error("Languaje is missing")
        }

        const user = await UserCollection.findOne({username})

        if(!user){
            throw Error("User not found")
        }

        const result = await bcrypt.compare(password, user.pwd);

        if(!result){
            throw Error("Invalid password")
        }

        return await createJWT({ ...user, id: user._id.toString() } as User, env.SECRET)
    }
};