const {
    normalizeQueryString,
} = require("../utils/commonModules");


require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env

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
    FROM [${DB_DATABASE}].[dbo].[tblCharityAccounts] as charityAcc 
        INNER JOIN [${DB_DATABASE}].[dbo].[tblCommonBaseData] as cmData
            on charityAcc.BankID = cmData.CommonBaseDataId
        INNER JOIN [${DB_DATABASE}].[dbo].[tblCommonBaseType] as cmType
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


async function checkDuplicateAccountNumber(connection, accountNumber) {
    let result = await ws_loadCharityAccounts(connection, {
        AccountNumber: accountNumber
    }, null, 1);
    // 0 -> unique 
    // 1 -> duplicate
    let duplicate = !(!result.recordset.length);
    return duplicate;
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


    // check for baseTypeTitle duplicates - returns: true -> duplicate | false -> unique
    const duplicateAccountNumber = await checkDuplicateAccountNumber(connection, AccountNumber);
    if (duplicateAccountNumber)
        return {
            status: "Failed",
            msg: "Error Creating Row, Duplicate AccountNumber",
            AccountNumber,
        };
    if (CardNumber) {
        const {
            validateCreditCard
        } = require("../utils/bankCardNumber");
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
    [${DB_DATABASE}].[dbo].[tblCharityAccounts]
    (BankId, BranchName, OwnerName, CardNumber, AccountNumber, AccountName)
    VALUES 
    ('${BankId}', N'${BranchName}', N'${OwnerName}', '${CardNumber}', '${AccountNumber}', N'${AccountName}'); 
    SELECT SCOPE_IDENTITY() AS charityAccountId;`
    try {
        const request = pool.request();
        const result = request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("ws_createCharityAccount error: ", err)
    }

}

const ws_updateCharityAccounts = async (connection, filters, newValues) => {
    if (newValues.AccountNumber) {
        const duplicateAccountNumber = await checkDuplicateAccountNumber(connection, newValues.AccountNumber);
        if (duplicateAccountNumber)
            return {
                status: "Failed",
                msg: "Error Creating Row, Duplicate AccountNumber",
                ...newValues.AccountNumber,
            };

    }

    let queryString = `UPDATE [${DB_DATABASE}].[dbo].[tblCharityAccounts] SET `
    const {
        setToQueryString
    } = require("../utils/commonModules")
    // setToQueryString returns: Update ... SET sth = 2, test = 3
    queryString = setToQueryString(queryString, newValues) + " WHERE 1=1 ";
    queryString = normalizeQueryString(queryString, filters);
    console.log(queryString)

    if (newValues.CardNumber) {
        CardNumber = newValues.CardNumber;
        const {
            validateCreditCard,
        } = require("../utils/bankCardNumber");
        // returns true if valid.
        const valid = validateCreditCard(String(CardNumber));
        if (!valid)
            return {
                status: "Failed",
                msg: "The Credit Card Number is Incorrect.",
                CardNumber
            }
    }

    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        // return table records
        const table = await ws_loadCharityAccounts(connection);
        return table;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}

const ws_deleteCharityAccounts = async (connection, charityAccountId) => {
    const {
        checkForeignKey
    } = require("../utils/commonModules");
    const canRemove = await checkForeignKey(connection, "tblCharityAccounts", charityAccountId);
    if (!canRemove) return {
        status: "Failed",
        msg: "Can not remove this ID",
        charityAccountId
    };

    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `DELETE [${DB_DATABASE}].[dbo].[tblCharityAccounts] WHERE CharityAccountId = ${charityAccountId};`
    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString);
        const table = await ws_loadCharityAccounts(connection);
        return table;
    } catch (err) {
        console.log("SQL error: ", err);
    }
}

module.exports = {
    ws_loadCharityAccounts,
    ws_createCharityAccounts,
    ws_updateCharityAccounts,
    ws_deleteCharityAccounts,
}