const db = require('../database/database')
const User = db.Models.User;
const Debt = db.Models.Debt;
const Utils = require('./utils');
const jwt = require('jsonwebtoken');
import {ApolloError} from 'apollo-server-errors';

class MyUtangError extends ApolloError {
    constructor(message, category) {
        super(message, category);
        this.title = title;
        this.description = description;
    }

}

const resolvers = {
        Query: {
            async currUser(root, context) {
                if (!context.user) return null;
                return context.user;
            },
            async userUnpaidDebt(root, context) {
                if (!context.user) throw new MyUtangError('User must be logged in', 'AuthenticationError');
                return Debt.findAll(
                    {
                        where: {
                            debtorId: context.user.id,
                            isPaid: false
                        }
                    }
                );
            },
            async userUnpaidLendedDebt(root, context) {
                if (!context.user) throw new MyUtangError('User must be logged in', 'AuthenticationError');
                return Debt.findAll(
                    {
                        where: {
                            lenderId: context.user.id,
                            isPaid: false
                        }
                    }
                );
            },
            async debtGrandTotal(root, {firstUserId, secondUserId}) {
                const firstUserDebts = await Debt.findAll(
                    {
                        where: {
                            debtorId: firstUserId,
                            lenderId: secondUserId,
                            isPaid: false
                        }
                    }
                );
                let firstUserTotal = 0;
                firstUserDebts.forEach(
                    (debt) => {
                        firstUserTotal += debt.dataValues.value;
                    }
                )
                const secondUserDebts = await Debt.findAll(
                    {
                        where: {
                            debtorId: secondUserId,
                            lenderId: firstUserId,
                            isPaid: false
                        }
                    }
                );
                let secondUserTotal = 0;
                secondUserDebts.forEach(
                    (debt) => {
                        secondUserTotal += debt.dataValues.value;
                    }
                )
                return firstUserTotal - secondUserTotal;
            }

        },
        Mutation: {
            async createDebt(root, {title, description, debtorId, value}, context) {
                if (!context.user) throw new MyUtangError('User must be logged in', 'AuthenticationError');
                if (debtorId === context.user.id) {
                    throw new MyUtangError('User should not create debt to him/herself', 'ValidationError');
                }
                return Debt.create({
                    title: title,
                    description: description,
                    debtorId: debtorId,
                    lenderId: lenderId,
                    value: value,
                    isPaid: false
                });
            },
            async register(root, {userName, password}) {
                let hash = await Utils.bcryptPassword(password);
                const currUser = await User.create({userName: userName, password: hash, discordId: null});
                return {token: jwt.sign(currUser.dataValues, process.env.JWT_SECRET)}

            },
            async login(root, {userName, password}) {
                const currUser = await User.findOne(
                    ({
                        where: {
                            userName: userName,
                        }
                    })
                );
                if (!currUser) throw new Error(new ValidationError('LoginFail', 'Wrong username').toJson());
                if (Utils.bcrypt.compareSync(password, currUser.dataValues.password)) {
                    return {
                        token: jwt.sign(currUser.dataValues, process.env.JWT_SECRET),
                    };
                } else {
                    throw new Error(new ValidationError('LoginFail', 'Wrong password').toJson());
                }
            },

            // signUp(userName: String!, password: String!): AuthPayLoad!
            // payAllDebts(userId: Int!):[Debt!]!
            // payAllDebtsBetween(debtorId: Int!, lenderId:Int!):[Debt!]!
            async payAllDebts(root, context) {
                if (!context.user) throw new MyUtangError('User must be logged in', 'AuthenticationError');
                return Debt.update({paid: true}, {
                        where:
                            {
                                debtorId: context.user.id
                            }
                    },
                );
            },
        }
    }
;
module.exports = resolvers;
