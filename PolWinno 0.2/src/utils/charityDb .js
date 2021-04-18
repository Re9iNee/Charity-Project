const sql = require("mssql");

const config = {
    user: "sa",
    password: "Rainbow78951",
    server: "localhost",
    database: "SabkadV01", 
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
};

const pool = new sql.ConnectionPool(config);


const poolConnect = pool.connect();


pool.on("error", err => {
    console.log("Could not Connect to the Database", err);
});

module.exports = {pool , poolConnect}