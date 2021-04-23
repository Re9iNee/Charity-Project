const {
    ws_loadCharityAccounts,
    ws_createCharityAccounts,
    ws_updateCharityAccounts,
    ws_deleteCharityAccounts
} = require("../services/charityAccounts");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getCharityAccount = async (req, res) => {
    let query = req.query;
    // T03 - Method 01
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
    res.send({
        result
    })
}


exports.createCharityAccount = async (req, res) => {
    // T04 - Method 02
    // Attach params to body as an JSON format - Postman Request:
    // https://documenter.getpostman.com/view/6106774/TzCQa6DK#4b0dc741-d2e1-46d4-b63a-e763d1d32ac4
    const result = await ws_createCharityAccounts({
        pool,
        poolConnect
    }, req.body);
    // sending req.body directly cause in that method we will deconstruct the object.
    res.send({
        result
    })
};


exports.updateCharityAccount = async (req, res) => {
    // T04 - Method 03
    // Attach filters object and newValues to request body
    // parameters: sql connection, filters, newValues
    // returns charityAccounts Table
    const result = await ws_updateCharityAccounts({
        pool,
        poolConnect
    }, req.body.filters, req.body.newValues);
    res.send({
        result
    });
};


exports.deleteCharityAccount = async (req, res) => {
    // T04 - Method 04
    // parameters: sql connection, charityAccountId
    const result = await ws_deleteCharityAccounts({
        pool,
        poolConnect
    }, req.body.charityAccountId);
    res.send({
        result
    });
};