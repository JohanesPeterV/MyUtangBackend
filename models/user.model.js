const {Sequelize, DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    // const DebtSeq=require('./debt.model');
    // const Debt=DebtSeq(sequelize,Sequelize);
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
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
    // User.hasMany(Debt);

    return User;
}



