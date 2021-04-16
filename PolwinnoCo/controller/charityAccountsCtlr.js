const {ws_loadCharityAccounts} = require("../services/charityAccounts");
const {poolConnect , pool} = require('../utils/charityDb ');



exports.createCharityAccount = async (req, res) => {
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
    res.send(result)
}