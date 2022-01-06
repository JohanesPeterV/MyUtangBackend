"use strict";

const db = require('./database/database');

// db.sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//
//         console.error('Unable to connect to the database:', err);
//     });
(async () => {
    await db.sequelize.sync({alter: true});
})();

Object.defineProperty(exports, "__esModule", {value: true});
const {ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./server/typedef');


const Debt = db.Debt
const User = db.User

const resolvers = {
        Query: {
            // books: [Book]
            async user(root, {id}) {

                return User.findByPk(id);
            },
            async userUnpaidDebt(root, {id}) {
                return Debt.findAll(
                    {
                        where: {
                            debtorId: id
                        }
                    }
                );
            }
        },
        Mutation: {
            async createUser(root, {name, password, discordId}) {
                return User.create({name: name, password: password, lastName: "Doe"});
            },
            async createDebt(root, {title, description, debtorId, lenderId}) {
                return Debt.create({
                    title: title,
                    description: description,
                    debtorId: debtorId,
                    lenderId: lenderId,
                    paid: false
                });
            }

        }
    }
;


const server = new ApolloServer({typeDefs, resolvers});
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
