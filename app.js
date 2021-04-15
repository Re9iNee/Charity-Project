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
    ws_deleteBaseValue,
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
    })
    .put(async (req, res) => {
        // T03 - Method 03
        // Attach filters object and newValues to request body
        const result = await ws_updateBaseValue({
            pool,
            poolConnect
        }, req.body.filters, req.body.newValues);
        res.send(result);
    })
    .delete(async (req, res) => {
        // T03 - Method 04
        // Attach commonBaseDataId to request body
        const result = await ws_deleteBaseValue({
            pool,
            poolConnect
        }, req.body.commonBaseDataId);
        res.send(result);
    });


app.route("/charityAccounts")
    .get(async (req, res) => {
        let query = req.query;
        // T04 - Method 01
        // path: /charityAccounts/?CharityAccountId=1&BankId=6&BranchName=Ame&OwnerName=Reza
        const result = await ws_loadCharityAccounts({
            pool,
            poolConnect
        }, {
            BankId: query.BankId,
            BranchName: query.BranchName,
            OwnerName: query.OwnerName,
            CardNumber: query.CardNumber,
            AccountNumber: query.AccountNumber,
            AccountName: query.AccountName,
            CharityAccountId: query.CharityAccountId,
            BaseTypeCode: query.BaseTypeCode,
        });
        // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
        res.send(result)
    })
    .post(async (req, res) => {
        // T04 - Method 02
        // Attach params to body as an JSON format - Postman Request:
        // https://documenter.getpostman.com/view/6106774/TzCQa6DK#4b0dc741-d2e1-46d4-b63a-e763d1d32ac4
        const result = await ws_createCharityAccounts({
            pool,
            poolConnect
        }, req.body);
        // sending req.body directly cause in that method we will deconstruct the object.
        res.send(result)
    })
    .put(async (req, res) => {
        // T04 - Method 03
        // Attach filters object and newValues to request body
        // parameters: sql connection, filters, newValues
        // returns charityAccounts Table
        const result = await ws_updateCharityAccounts({
            pool,
            poolConnect
        }, req.body.filters, req.body.newValues);
        res.send(result);
    })
    .delete(async (req, res) => {
        // T04 - Method 04
        // parameters: sql connection, charityAccountId
        const result = await ws_deleteCharityAccounts({
            pool,
            poolConnect
        }, req.body.charityAccountId);
        res.send(result);
    });

/* Task 04 */
const {
    ws_loadCharityAccounts,
    ws_createCharityAccounts,
    ws_updateCharityAccounts,
    ws_deleteCharityAccounts,
} = require("./T04 - Charity Accounts/charityAccounts");
(async () => {
    // Task 04 Method 01
    // const result = await ws_loadCharityAccounts({
    //     pool,
    //     poolConnect
    // }, {
    //     BankId: 6,
    //     BaseTypeCode: '1'
    // })
    // console.log(result)
    // Task 04 Method 02
    // const result = await ws_createCharityAccounts({
    //     pool,
    //     poolConnect
    // }, {
    //     BankId: 7,
    //     BranchName: "Ahmadabad",
    //     OwnerName: "Ali",
    //     CardNumber: "5022291025692979",
    //     AccountNumber: "3",
    //     AccountName: "Nam-e-Hesab"
    // });
    // console.log(result);
    // Task 04 Method 03
    // parameters: sql connection, filters, newValues
    // const result = await ws_updateCharityAccounts({
    //     pool,
    //     poolConnect
    // }, {
    //     CharityAccountId: "1"
    // }, {
    //     CardNumber: "6037691596008235",
    //     BranchName: "Molasadra",
    // });
    // console.log(result);
    // Task 04 Method 04
    // parameters: sql connection, charityAccountId
    // const result = await ws_deleteCharityAccounts({
    //     pool,
    //     poolConnect
    // }, "1");
    // console.log(result);
})();