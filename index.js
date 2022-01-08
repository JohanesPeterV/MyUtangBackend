"use strict";

const db = require('./database/database');

import { ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";

(async () => {
    await db.sequelize.sync({alter: true});
})();

Object.defineProperty(exports, "__esModule", {value: true});
const {ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./server/typedef');

const Debt = db.Models.Debt
const User = db.Models.User
const resolvers = require('./server/resolvers',);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    debug: true,
    playground: true,
    introspection: true,
    plugins:[
        ApolloServerPluginLandingPageLocalDefault()
    ]
});

server.listen(process.env.PORT).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});

