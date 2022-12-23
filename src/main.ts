import { ApolloServer } from "apolloserver"
import { startStandaloneServer } from "apolloserver/standalone"
import {Query} from "./resolvers/query.ts";
import {Mutation} from "./resolvers/mutation.ts";
import {typeDefs} from "./schema.ts";
import { Message } from "./resolvers/message.ts";
import { User } from "./resolvers/user.ts";
import { config } from "dotenv"

const env = config();

if (!env?.PORT) {
    throw Error("Port is missing")
}

const resolvers = {
    Query,
    Mutation,
    Message,
    User
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: env.PORT },
    context: ({req}) => {
        const auth = req.headers.auth || ""
        const lang = req.headers.lang || ""

        return {auth,lang}
    }
})

console.log(`Server running on: ${url}`);