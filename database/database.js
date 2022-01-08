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
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
);
sequelize.then(() => {
        console.log("Connections has been established successfully.")
    }).catch((err)=>{
        console.log("Unable to connect to the database:",err)
})

const ConstructModels = require('./models');

const Models = ConstructModels(sequelize)


db[Models.User.name] = Models.User
db[Models.Debt.name] = Models.Debt


// Apply associations
Object.keys(db).forEach(key => {
    if ('associate' in db[key]) {
        db[key].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Models = Models

module.exports = db;
