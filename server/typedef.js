const {gql} = require('apollo-server');
const typeDefs = gql`
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
        user(id: ID!): User!
        userUnpaidDebt(id: ID!):[Debt!]!
        debtGrandTotal(firstUserId: ID!, secondUserId:ID!):Int!
    }
    type AuthPayLoad{
        token: String!
    }
    type Mutation{
        createUser(userName: String!, password: String!, discordId: String):User!
        createDebt(title: String!, description: String!, debtorId:ID!, lenderId:ID!,value: Int!):Debt!
        register(userName: String!, password: String!): AuthPayLoad!
        login(userName: String!, password: String!): AuthPayLoad!
    }
`;
module.exports = typeDefs;
