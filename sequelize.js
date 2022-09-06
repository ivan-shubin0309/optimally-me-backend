const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const config = dotenv.parse(fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)));

module.exports = {
    "host": config.DB_HOST,
    "port": config.DB_PORT,
    "database": config.DB_NAME,
    "username": config.DB_USER,
    "password": config.DB_PASSWORD,
}
