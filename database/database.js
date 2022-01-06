const Sequelize = require('sequelize');

// const module = require('module');
const config = require('../config.json');
const dbConfig = config.Database;
let db = {}

const sequelize = new Sequelize(
    dbConfig.name,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        // define: {
        //     freezeTableName: true,
        // },
        // pool: {
        // max: 5,
        // min: 0,
        // acquire: 30000,
        // idle: 10000,
        // },
    },
)

const UserSeq = require('../models/user.model');
const DebtSeq = require('../models/debt.model');

const User = UserSeq(sequelize, Sequelize)
db[User.name] = User
const Debt = DebtSeq(sequelize, Sequelize)
db[Debt.name] = Debt



// Apply associations
Object.keys(db).forEach(key => {
    if ('associate' in db[key]) {
        db[key].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.User=User
db.Debt=Debt

module.exports = db;
