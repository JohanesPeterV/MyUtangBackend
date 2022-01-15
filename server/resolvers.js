const db = require('../database/database')
const User = db.Models.User;
const Debt = db.Models.Debt;
const Utils = require('./utils');
const jwt = require('jsonwebtoken');

class ValidationError {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }

    toJson() {
        return {
            'title': this.title,
            'description': this.description,
        }
    }
}

const resolvers = {
        Query: {

            async user(root, {id}) {
                return User.findByPk(id);
            },
            async getUser(root, {token}) {

            },
            async userUnpaidDebt(root, {id}) {
                return Debt.findAll(
                    {
                        where: {
                            debtorId: id,
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
                // console.log(firstUserDebts);
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
                // console.log(firstUserDebts);
                secondUserDebts.forEach(
                    (debt) => {
                        secondUserTotal += debt.dataValues.value;
                    }
                )
                return firstUserTotal - secondUserTotal;
            }

        },
        Mutation: {
            async createUser(root, {userName, password, discordId}) {
                let currUser = null;
                let hash = await Utils.bcryptPassword(password);
                return User.create({userName: userName, password: hash, discordId: discordId});
            },
            async createDebt(root, {title, description, debtorId, lenderId, value}) {
                if (debtorId === lenderId) {
                    throw new Error(new ValidationError("IllegalInput", "Debtor and lender could not be the same person").toJson())
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
            }
            // signUp(userName: String!, password: String!): AuthPayLoad!
            // payAllDebts(userId: Int!):[Debt!]!
            // payAllDebtsBetween(debtorId: Int!, lenderId:Int!):[Debt!]!

            // async payAllDebts(root, {userId}) {
            //     Debt.update({paid: true}, {
            //             where:
            //                 {
            //                 debtorId:userId
            //             }
            //         });
            // },
        }
    }
;
module.exports = resolvers;
