const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const sequelize = dotenv.parse(fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)));

module.exports = {
    "host": sequelize.DB_HOST,
    "port": sequelize.DB_PORT,
    "database": sequelize.DB_NAME,
    "username": sequelize.DB_USER,
    "password": sequelize.DB_PASSWORD,
    "charset": "utf8mb4",
    "dialect": "mysql",
    "connectionRetryCount": 5,
    "maxConnections": 10,
    "delayBeforeReconnect": 3000,
    "showErrors": true,
}
