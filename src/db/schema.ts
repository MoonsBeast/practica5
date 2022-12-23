import {User,Message} from "../types.ts";
import {ObjectId} from "mongo";

export type UserSchema = Omit<User, "id"> & {
    _id: ObjectId
};

export type MessageSchema = Omit<Message, "id" | "sender" | "receiver"> & {
    _id: ObjectId;
    sender: ObjectId,
    receiver: ObjectId
};