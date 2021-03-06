const {
    normalizeQueryString,
    checkDuplicate,
    NotNullColumnsFilled,
} = require("../utils/commonModules");


require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env

const ws_loadCharityAccounts = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
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
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}


const ws_createCharityAccounts = async (connection, details = new Object(null)) => {
    // default parameter for details will be null object. (to avoid throwing error - we search in this object later)
    // details are the parameters sent for creating table
    const {
        BankID,
        BranchName,
        OwnerName,
        CardNumber,
        AccountNumber,
        AccountName
    } = details;


    // Not Null Values
    if (!NotNullColumnsFilled(details, "BankID", "OwnerName", "BranchName", "AccountNumber")) {
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            requiredColumns: ["BankId", "OwnerName", "BranchName", "AccountNumber"],
            details
        }
    }

    // Credit Card Validation if it exists
    if ("CardNumber" in details) {
        const {
            validateCreditCard
        } = require("../utils/bankCardNumber");
        // returns true if valid.
        const valid = validateCreditCard(String(CardNumber));
        if (!valid) {
            return {
                status: "Failed",
                msg: "The Credit Card Number is Incorrect.",
                CardNumber
            }
        }
    }

    // check for baseTypeTitle duplicates - returns: true -> duplicate | false -> unique
    const duplicateAccountNumber = await checkDuplicate(connection, {
        AccountNumber
    }, ws_loadCharityAccounts);
    if (duplicateAccountNumber)
        return {
            status: "Failed",
            msg: "Error Creating Row, Duplicate AccountNumber",
            AccountNumber,
        };
    


    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `INSERT INTO 
    [${DB_DATABASE}].[dbo].[tblCharityAccounts]
    (BankID, BranchName, OwnerName, CardNumber, AccountNumber, AccountName)
    VALUES 
    ('${BankID}', N'${BranchName}', N'${OwnerName}', '${CardNumber}', '${AccountNumber}', N'${AccountName}'); 
    SELECT SCOPE_IDENTITY() AS CharityAccountId;`
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        return result;
    } catch (err) {
        console.error("ws_createCharityAccount error: ", err)
        return {
            status: "Failed",
            method: "ws_createCharityAccount",
            msg: err
        }
    }

}

const ws_updateCharityAccounts = async (connection, filters, newValues = new Object(null)) => {

    if ("CardNumber" in newValues) {
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

    // check wheter Account Number is Unique or not.
    if ("AccountNumber" in newValues) {
        const duplicateAccountNumber = await checkDuplicate(connection, {
            AccountNumber: newValues.AccountNumber
        }, ws_loadCharityAccounts);
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
        return {
            status: "Failed",
            method: "ws_updateCharityAccount",
            mgs: err
        }
    }
}

const ws_deleteCharityAccounts = async (connection, charityAccountId) => {
    const {
        checkForeignKey
    } = require("../utils/commonModules");
    const canRemove = await checkForeignKey(connection, "tblCharityAccounts", charityAccountId);
    if (!canRemove) return {
        status: "Failed",
        msg: "Can not remove this ID, this ID depend on tblPayment",
        charityAccountId,
        dependency: ["tblPayment"]
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
        return {
            status: "Failed",
            method: "ws_deleteCharityAccount",
            msg: err
        }
    }
}

module.exports = {
    ws_loadCharityAccounts,
    ws_createCharityAccounts,
    ws_updateCharityAccounts,
    ws_deleteCharityAccounts,
}