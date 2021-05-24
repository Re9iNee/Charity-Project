const sql = require("mssql");
require("dotenv").config({
    path: "./utils/.env"
});
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustedconnection: true
    }
};

const pool = new sql.ConnectionPool(config);


const poolConnect = pool.connect();

// TODO: on database load and other errors.
pool.on("error", err => {
    console.log("Could not Connect to the Database", err);
});

module.exports = {
    pool,
    poolConnect
}