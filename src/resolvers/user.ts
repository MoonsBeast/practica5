import { UserSchema } from "../db/schema.ts";

export const User = {
    id: (parent: UserSchema) => parent._id.toString()
}