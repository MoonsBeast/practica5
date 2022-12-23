import { UserCollection } from "../db/db.ts";
import { MessageSchema } from "../db/schema.ts";
import { ObjectId } from "mongo"

export const Message = {
    id: (parent: MessageSchema) => parent._id.toString(),
    sender: async (parent: MessageSchema) => await UserCollection.findOne({_id: new ObjectId(parent.sender)}),
    receiver: async (parent: MessageSchema) => await UserCollection.findOne({ _id: new ObjectId(parent.receiver) })
}