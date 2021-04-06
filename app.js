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
    .post(async (req, res) => {
        // T02 - Method 02
        // Attach BaseTypeTitle via JSON File to request.body
        const result = await ws_createBaseType({
            pool,
            poolConnect
        }, req.body.BaseTypeTitle)
        res.send({
            result
        })
    })
    .put(async (req, res) => {
        // T02 - Method 03
        // Attach BaseTypeTitle And Filter Object via JSON File to request.body
        let filters = req.body.filters;
        let newTitle = req.body.BaseTypeTitle;
        const result = await ws_updateBaseType({
            pool,
            poolConnect
        }, filters, newTitle);
        res.send(result);
    })
    .delete(async (req, res) => {
        // T02 - Method 04
        // Attach commonBaseTypeId to JSON Body
        let id = req.body.commonBaseTypeId;
        const result = await ws_deleteBaseType({
            pool,
            poolConnect
        }, id);
        res.send({
            result
        });
    })



const {
    ws_loadBaseType,
    ws_createBaseType,
    ws_updateBaseType,
    ws_deleteBaseType
} = require("./T02-Creating Constant Identifiers/commonBaseMethods");



/*  TASK 3 */
const {
    ws_loadBaseValue,
    ws_createBaseValue,
    ws_updateBaseValue,
} = require("./T03 - BaseInfo Services - Constant Values Task/constantValues");

app.route("/commonBaseData")
    .get(async (req, res) => {
        let query = req.query;
        // T03 - Method 01
        // path: /commonBaseData/?CommonBaseDataId=4&BaseCode=3&BaseValue=Asghar&CommonBaseTypeId=1
        const result = await ws_loadBaseValue({
            pool,
            poolConnect
        }, {
            CommonBaseDataId: query.CommonBaseDataId,
            BaseCode: query.BaseCode,
            BaseValue: query.BaseValue,
            CommonBaseTypeId: query.CommonBaseTypeId
        });
        res.send(result)
    })
    .post(async (req, res) => {
        // T03 - Method 02
        // Attach baseValue and commonBaseTypeId to request body
        let {
            baseValue,
            commonBaseTypeId
        } = req.body;
        const result = await ws_createBaseValue({
            pool,
            poolConnect
        }, baseValue, commonBaseTypeId)
        res.send(result);
    });



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
    // }, '2', '4')
    // Method 03
    const result = await ws_updateBaseValue({
        pool,
        poolConnect
    }, {
        CommonBaseTypeId: 4
    }, {
        baseValue: 256
    })
})();