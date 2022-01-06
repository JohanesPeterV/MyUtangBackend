const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    const User = require('./user.model')
    const user = User(sequelize, Sequelize)
    const Debt = sequelize.define('Debt', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        debtorId: {
            type: DataTypes.INTEGER,
            references: {
                model: user,
                key: 'id'
            }
        },
        lenderId: {
            type: DataTypes.INTEGER,
            references: {
                model: user,
                key: 'id'
            }
        },
        paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {timestamps: true});
    return Debt;
}



