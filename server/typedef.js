const {gql} = require('apollo-server');
const typeDefs = gql`
    type User{
        id: ID!
        discordId: String
        userName: String!
        password: String!
    }
    type Debt{
        id: ID!
        title: String!
        description: String!
        debtorId: ID!
        lenderId: ID    !
        amount: Int!
        isPaid: Boolean!
    }
    type Query{
        user: User
        users:[User!]!
        unpaidDebts:[Debt!]!
        unpaidLendedDebts:[Debt!]!
        debtGrandTotal(firstUserId: ID!, secondUserId:ID!):Int!
    }
    type AuthPayLoad{
        token: String!
    }
    type Mutation{
        createDebt(title: String!, description: String!, debtorId:ID!,amount: Int!):Debt!
        register(userName: String!, password: String!): AuthPayLoad!
        login(userName: String!, password: String!): AuthPayLoad!
        payAllDebts:[Debt!]!
    }
`;
module.exports = typeDefs;
