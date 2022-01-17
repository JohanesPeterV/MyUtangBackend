const db = require('../database/database')
const User = db.Models.User;
const Debt = db.Models.Debt;
const Utils = require('./utils');
const jwt = require('jsonwebtoken');
const ApolloError = require('apollo-server-errors');

class MyUtangError extends ApolloError.ApolloError {
    constructor(message, category) {
        super(message, category);
        Object.defineProperty(this, 'name', {value: 'MyError'});
    }

}

const resolvers = {
        Debt: {
            debtor(parent) {
                return User.findOne((
                    {
                        where: {
                            id: parent.debtor
                        }
                    }
                ));
            },
            lender(parent) {
                return User.findOne({
                    where: (
                        {
                            id: parent.lender
                        }
                    )
                });
            }
        },
        Query: {
            async user(root, args, context) {
                return context.user;
            },
            async users(root, args, context) {
                return User.findAll();
            },
            async unpaidDebts(root, args, context) {
                return Debt.findAll(
                    {
                        where: {
                            debtor: context.user.id,
                            isPaid: false
                        }
                    }
                );
            },
            async unpaidLendedDebts(root, args, context) {
                return Debt.findAll(
                    {
                        where: {
                            lender: context.user.id,
                            isPaid: false
                        }
                    }
                );
            },
            async debtGrandTotal(root, {firstUserId, secondUserId}) {
                const firstUserDebts = await Debt.findAll(
                    {
                        where: {
                            debtor: firstUserId,
                            lender: secondUserId,
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
                            debtor: secondUserId,
                            lender: firstUserId,
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
            async createDebt(root, {title, description, debtorId, amount}, context) {
                if (debtorId.toString() === context.user.id.toString()) {
                    throw new MyUtangError('User should not create debt to him/herself', 'ValidationError');
                }
                return Debt.create({
                    title: title,
                    description: description,
                    debtor: debtorId,
                    lender: context.user.id,
                    amount: amount,
                    isPaid: false
                });
            },
            async register(root, {
                userName, password
            }) {
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
                if (!currUser) throw new Error(new MyUtangError('LoginFail', 'Wrong username'));
                if (Utils.bcrypt.compareSync(password, currUser.dataValues.password)) {
                    return {
                        token: jwt.sign(currUser.dataValues, process.env.JWT_SECRET),
                    };
                } else {
                    throw new Error(new MyUtangError('LoginFail', 'Wrong password'));
                }
            },
            async payAllDebts(root, args, context) {
                return await Debt.update({isPaid: true}, {
                        where:
                            {
                                debtor: context.user.id
                            },
                        returning: true,
                        plain: true
                    },
                );
            },
            async payDebt(root, {debtId}, context) {
                let temp;
                const test = await Debt.update({isPaid: true}, {
                        where:
                            {
                                debtor: context.user.id,
                                id: debtId
                            },
                        returning: true,
                        plain: true
                    },
                ).then((result) => {
                    console.log(result)
                })
                console.log('disini')
                console.log(test);
                return test
            }
        }
    }
;
module.exports = resolvers;
