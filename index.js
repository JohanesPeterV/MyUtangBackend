"use strict";

const db = require('./database/database');

const apolloCore = require("apollo-server-core");

const ApolloError = require('apollo-server-errors');
class MyUtangError extends ApolloError.ApolloError {
    constructor(message, category) {
        super(message, category);
        this.title = title;
        this.description = description;
    }

}

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
const server = new ApolloServer({
    typeDefs,
    resolvers,
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

