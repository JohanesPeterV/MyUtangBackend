const {gql} = require('apollo-server');
const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type User{
        id: Int!
        discordId: String
        userName: String!
        password: String!
    }
    type Debt{
        id: Int!
        title: String!
        description: String!
        debtorId: Int!
        lenderId: Int!
        value: Int!
        paid: Boolean!
    }
    type Query{
        books: [Book]
        user(id: ID!): User!
        userUnpaidDebt(id: ID!):[Debt!]!
        debtGrandTotal(firstUserId: ID!, secondUserId:ID!):Int!
    }
    type Mutation{
        createUser(userName: String!, password: String!, discordId: String):User!
        createDebt(title: String!, description: String!, debtorId:ID!, lenderId:ID!,value: Int!):Debt!
    }
`;
module.exports = typeDefs;
