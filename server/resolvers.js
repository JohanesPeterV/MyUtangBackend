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
                console.log(parent)
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
                const currUser = await User.findOne(
                    ({
                        where: {
                            id: context.user.id
                        }
                    })
                );
                return currUser;
            },
            async users(root, args, context) {
                return User.findAll();
            },
            async debtHistory(root, args, context) {
                return Debt.findAll(
                    {
                        where: {
                            debtor: context.user.id,
                            isPaid: true
                        }
                    }
                );
            },
            async lendingHistory(root, args, context) {
                return Debt.findAll(
                    {
                        where: {
                            lender: context.user.id,
                            isPaid: true
                        }
                    }
                );
            },
            async unpaidDebts(root, args, context) {
                return Debt.findAll(
                    {
                        where: {
                            debtor: context.user.id,
                            isPaid: false
                        },
                        order: [
                            ['lender', 'ASC'],
                        ]
                    }
                );
            },
            async unpaidLendings(root, args, context) {
                return Debt.findAll(
                    {
                        where: {
                            lender: context.user.id,
                            isPaid: false
                        },
                        order: [
                            ['debtor', 'ASC'],
                        ]
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
                if (amount < 1000) {
                    throw new MyUtangError('Utang should not be less than 1000', 'ValidationError');
                }
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
                            userName: db.sequelize.where(
                                db.sequelize.fn('LOWER', db.sequelize.col('userName'),), 'LIKE', userName.toLowerCase()
                            ),
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
                const debts = await Debt.findAll(
                    ({
                        where:
                            {
                                debtor: context.user.id,
                                isPaid: false
                            },
                    })
                );
                Debt.update({isPaid: true}, {
                        where:
                            {
                                debtor: context.user.id
                            },
                    },
                );
                return debts;
            },
            async payDebt(root, {debtId}, context) {
                function update() {
                    return new Promise(
                        resolve => {
                            Debt.update({isPaid: true}, {
                                    where:
                                        {
                                            debtor: context.user.id,
                                            id: debtId
                                        },
                                    returning: true,
                                    plain: true
                                },
                            ).then((result) => {
                                resolve(result);
                            })
                        }
                    )
                }

                const data = await update();
                return data[1];
            },
            async markLendingAsPaid(root, {debtId}, context) {
                function update() {
                    return new Promise(
                        resolve => {
                            Debt.update({isPaid: true}, {
                                    where:
                                        {
                                            lender: context.user.id,
                                            id: debtId
                                        },
                                    returning: true,
                                    plain: true
                                },
                            ).then((result) => {
                                resolve(result);
                            })
                        }
                    )
                }

                const data = await update();
                return data[1];
            },
            async changePassword(root, {oldPassword, newPassword}, context) {
                const currUser = await User.findOne(
                    ({
                        where: {
                            id: context.user.id,
                        }
                    })
                );

                if (!Utils.bcrypt.compareSync(oldPassword, currUser.dataValues.password)) {
                    throw new MyUtangError('Wrong old password', 'ValidationError');
                }

                let hash = await Utils.bcryptPassword(newPassword);

                function updatePassword() {
                    return new Promise(
                        resolve => {
                            User.update(
                                {
                                    password: hash,
                                }, {
                                    where:
                                        {
                                            id: context.user.id,
                                        },
                                    returning: true,
                                    plain: true
                                },
                            ).then((result) => {
                                    resolve(result);
                                }
                            );
                        }
                    )
                }

                const data = await updatePassword();
                return data[1];
            },
            async changeUserName(root, {userName}, context) {
                function updateUser() {
                    return new Promise(
                        (resolve, reject) => {
                            try {
                                User.update(
                                    {
                                        userName: userName,
                                    }, {
                                        where:
                                            {
                                                id: context.user.id,
                                            },
                                        returning: true,
                                        plain: true
                                    },
                                ).then((result) => {
                                        resolve(result);
                                    }
                                ).catch((e) => {
                                    throw new MyUtangError(e.message, 'ConstraintError');
                                });
                            } catch (e) {
                                throw new MyUtangError(e.message, 'ConstraintError');
                            }
                        },
                    )
                }
                const data = await updateUser().catch((e)=>{
                    throw new MyUtangError(e.message, 'ConstraintError');
                });
                return data[1];
            },

            async updateDebt(root, {debtId, debtorId, title, description, amount}, context) {
                function update() {
                    return new Promise(
                        resolve => {
                            Debt.update({
                                    debtorId: debtorId,
                                    title: title,
                                    description: description,
                                    amount: amount
                                }, {
                                    where:
                                        {
                                            lender: context.user.id,
                                            id: debtId
                                        },
                                    returning: true,
                                    plain: true
                                },
                            ).then((result) => {
                                resolve(result);
                            })
                        }
                    )
                }

                const data = await update();
                return data[1];
            }
        }
    }
;
module.exports = resolvers;
