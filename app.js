require("dotenv").config();


const sql = require("mssql");
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
}
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
pool.on("error", err => {
    console.log("Could not Connect to the Database", err);
})



const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`)
});
app.use(express.json({
    limit: '1mb'
}));


/*  TASK 2 */

app.route("/commonBaseType")
    .get(async (req, res) => {
        let query = req.query;
        // T02 - Method 01
        // path: /commonBaseType/?CommonBaseTypeId=4&BaseTypeCode=3&BaseTypeTitle=Asghar
        const result = await ws_loadBaseType({
            pool,
            poolConnect
        }, {
            BaseTypeCode: query.BaseTypeCode,
            BaseTypeTitle: query.BaseTypeTitle,
            CommonBaseTypeId: query.CommonBaseTypeId
        });
        res.send(result)
    })

const {
    ws_loadBaseType,
    ws_createBaseType,
} = require("./T02-Creating Constant Identifiers/commonBaseMethods");









// Example: Task 03, Method 01
/*  TASK 3 */
const {
    ws_loadBaseValue,
    ws_createBaseValue
} = require("./T03 - BaseInfo Services - Constant Values Task/constantValues");
(async () => {
    // Method 01
    // const result = await ws_loadBaseValue({
    //     pool,
    //     poolConnect
    // }, {
    //     CommonBaseDataId: 1,
    //     CommonBaseTypeId: '5',
    //     BaseCode: '2',
    //     BaseValue: 'dwad',
    // })
    // Method 02
    // const result = await ws_createBaseValue({
    //     pool,
    //     poolConnect
    // }, '23', '24', '4')
})();