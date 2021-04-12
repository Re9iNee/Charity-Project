const {
    normalizeQueryString,
} = require("../others/commonModules")
const ws_loadCharityAccounts = async (connection, filters, customQuery = null, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [CharityAccountId]
    ,[BankID]
    ,[BranchName]
    ,[OwnerName]
    ,[CardNumber]
    ,[AccountNumber]
    ,[AccountName]
    ,[BaseTypeCode]
    ,[BaseTypeTitle]
    ,[BaseCode]
    ,[BaseValue]
    ,[CommonBaseDataId]
    FROM [SabkadV01].[dbo].[tblCharityAccounts] as charityAcc 
        INNER JOIN [SabkadV01].[dbo].[tblCommonBaseData] as cmData
            on charityAcc.BankID = cmData.CommonBaseDataId
        INNER JOIN [SabkadV01].[dbo].[tblCommonBaseType] as cmType
            on cmData.CommonBaseTypeId = cmType.CommonBaseTypeId
    WHERE 1 = 1 `;
    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`;
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}


const ws_createCharityAccounts = async (connection, details) => {
    // details are the parameters sent for creating table


    const {
        BankId,
        BranchName,
        OwnerName,
        CardNumber,
        AccountNumber,
        AccountName
    } = details;
    if (CardNumber) {
        const {
            validateCreditCard
        } = require("../others/bank");
        // returns true if valid.
        const valid = validateCreditCard(String(CardNumber));
        console.log(valid);
        if (!valid) {
            return {
                status: "Failed",
                msg: "The Credit Card Number is Incorrect.",
                CardNumber
            }
        }
    }
    if (!BankId || !OwnerName || !BranchName || !AccountNumber) {
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            details
        }
    }


    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `INSERT INTO 
    [SabkadV01].[dbo].[tblCharityAccounts]
    (BankId, BranchName, OwnerName, CardNumber, AccountNumber, AccountName)
    VALUES 
    ('${BankId}', '${BranchName}', ${OwnerName}, ${CardNumber}, ${AccountNumber}, ${AccountName}); 
    SELECT SCOPE_IDENTITY() AS CommonBaseDataId;`

    try {
        const request = pool.request();
        const result = request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("ws_createCharityAccount error: ", err)
    }

}

module.exports = {
    ws_loadCharityAccounts,
    ws_createCharityAccounts,
}