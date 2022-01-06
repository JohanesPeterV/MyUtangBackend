const db=require('../database/database')
const User=db.Models.User;
const Debt=db.Models.Debt;

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
                if (debtorId === lenderId) {
                    throw {
                        "type": "FailedValidation",
                        "message": "Debtor and lender should not be the same person"
                    }
                }
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
module.exports=resolvers;
