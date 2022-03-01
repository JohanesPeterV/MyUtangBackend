const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        discordId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: true,
                name: 'unique_user_name',
                fields: [sequelize.fn('lower', sequelize.col('userName'))],
            }
        ]
    });
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
        debtor: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
            allowNull: false,
        },
        lender: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false

        }
    }, {timestamps: true});
    return {User: User, Debt: Debt};
}



