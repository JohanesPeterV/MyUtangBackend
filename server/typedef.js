

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
        paid: Boolean!
    }
    type Query{
        books: [Book]
        user(id: Int!): User!
        userUnpaidDebt(id: Int!):[Debt!]!
    }
    type Mutation{
        createUser(userName: String!, password: String!, discordId: String):User!
        createDebt(title: String!, description: String!, debtorId:Int!, lenderId:Int!):Debt!
    }
`;
module.exports=typeDefs;
