const {gql} = require('apollo-server');
const typeDefs = gql`
    directive @auth on FIELD_DEFINITION
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
        debtor: User!
        lender: User!
        amount: Int!
        isPaid: Boolean!
    }
    type AuthPayLoad{
        token: String!
    }
    type Query{
        user: User @auth
        users:[User!]! @auth
        unpaidDebts:[Debt!]! @auth
        unpaidLendings:[Debt!]! @auth
        debtHistory:[Debt!]! @auth
        lendingHistory:[Debt!]! @auth
        debtGrandTotal(firstUserId: ID!, secondUserId:ID!):Int! @auth
    }
    type Mutation{
        createDebt(title: String!, description: String!, debtorId:ID!,amount: Int!):Debt! @auth
        register(userName: String!, password: String!): AuthPayLoad!
        login(userName: String!, password: String!): AuthPayLoad!
        payAllDebts:[Debt!]! @auth
        payDebt(debtId: ID!): Debt! @auth
        markLendingAsPaid(debtId: ID!): Debt! @auth
        updateDebt(debtId: ID!, title: String!, description: String!, amount:Int!):Debt! @auth
        changeUserName(userName: String!): User! @auth
    }
`;
module.exports = typeDefs;
