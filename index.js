"use strict";


const authDirectiveTransformer = require('./server/directives/auth')
const db = require('./database/database');

const apolloCore = require("apollo-server-core");


(async () => {
    await db.sequelize.sync({alter: true});
})();

Object.defineProperty(exports, "__esModule", {value: true});
const {ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./server/typedef');

const Debt = db.Models.Debt
const User = db.Models.User
const resolvers = require('./server/resolvers',);
const jwt = require('jsonwebtoken');
const {makeExecutableSchema} = require('@graphql-tools/schema');


let schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
console.log('aaa :')
console.log(authDirectiveTransformer);
schema = authDirectiveTransformer(schema, 'auth');
const server = new ApolloServer({
    schema,

    context: ({req}) => {
        const auth = req.headers.authorization;
        let user = null;
        if (auth) {
            const token = auth.replace('Bearer ', '');
            user = jwt.verify(token, process.env.JWT_SECRET);
        }
        return {user};
    },
    debug: true,
    playground: true,
    introspection: true,
    plugins: [
        apolloCore.ApolloServerPluginLandingPageLocalDefault()
    ]
});

server.listen(process.env.PORT).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});

