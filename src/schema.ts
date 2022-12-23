import {gql} from "graphql_tag";

export const typeDefs = gql`
    scalar Date
    
    type User{
        id: ID!
        username: String!
        lang: String!
        pwd: String!
        creationDate: Date!
    }

    type Message{
        id: ID!
        sender: User!
        receiver: User!
        body: String!
        time: Date!
    }

    type Query{
        getMessages(page: Int!, perPage: Int!): [Message!]!
        login(username: String!, password: String!): String!
    }

    type Mutation{
        createUser(username: String!, password: String!): User!
        deleteUser: User
        sendMessage(receiver: ID!, body: String!): Message!
    }
`