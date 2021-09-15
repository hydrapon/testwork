require('dotenv').config()
module.exports = {
    development: {
        dialect: 'postgres',
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        username: process.env.PG_NAME,
        password: process.env.PG_PASS,
        database: process.env.PG_DB,
    },
    test: {
        dialect: 'postgres',
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        username: process.env.PG_NAME,
        password: process.env.PG_PASS,
        database: process.env.PG_DB,
    },
    production: {
        dialect: 'postgres',
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        username: process.env.PG_NAME,
        password: process.env.PG_PASS,
        database: process.env.PG_DB,
    },
}