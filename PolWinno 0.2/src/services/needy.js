const {
    normalizeQueryString,
    setToQueryString,
    checkForeignKey,
    checkDuplicate
} = require("../utils/commonModules");
const {
    validateCreditCard
} = require("../utils/bankCardNumber");

require("dotenv").config({
    path: "../utils/config.env"
});

const {ws_loadBaseValue} = require("./commonBaseData");
const {ws_loadPersonal} = require("./personal");

const {
    DB_DATABASE
} = process.env



const availableId = async(connection, BankId , NeedyId) => {
   

    if(BankId){
        const availableDataId = await ws_loadBaseValue(connection, {
            CommonBaseDataId: BankId
        }, null, 1);
        return !(!availableDataId.recordset.length);

    } else if(NeedyId){
        const availablePersonId = await ws_loadPersonal(connection, {
            PersonId: NeedyId
        }, null, 1);
        return !(!availablePersonId.recordset.length);
    }
};


const ws_loadNeedyAccount = async (connection, filters, customeQuery = null, resultLimit = 1000) => {

    //connection set
    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    //get all datas from needy table
    let queryString = `SELECT TOP (${resultLimit}) [NeedyAccountId],
        [BankId], 
        [NeedyId], 
        [OwnerName], 
        [CardNumber], 
        [AccountNumber], 
        [AccountName], 
        [ShebaNumber],
        [Name], 
        [Family], 
        [NationalCode], 
        [IdNumber], 
        [Sex], 
        [BirthDate], 
        [BirthPlace], 
        [PersonType], 
        [PersonPhoto],
        [BaseValue],
        [BaseCode]
    FROM [${DB_DATABASE}].[dbo].[tblNeedyAccounts] as needyAcc
        INNER JOIN [${DB_DATABASE}].[dbo].[tblPersonal] as personalData
            on needyAcc.NeedyId = personalData.PersonId

        INNER JOIN [${DB_DATABASE}].[dbo].[tblCommonBaseData] as commonBaseData
            on needyAcc.BankId = commonBaseData.CommonBaseDataId
    WHERE 1=1`;

    // create our query string
    queryString = normalizeQueryString(queryString, filters);
    if (customeQuery)
        queryString += ` ${customeQuery}`

    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("SQL error:", err);
    }
};


const ws_createNeedyAccount = async (connection, values) => {

    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    // destruct our input values
    const {
        BankId,
        NeedyId,
        OwnerName,
        CardNumber,
        AccountNumber,
        AccountName,
        ShebaNumber
    } = values;

    // bank card validation
    if (CardNumber) {
        const valid = validateCreditCard(String(CardNumber));
        if (!valid) {
            return {
                status: "Failed",
                msg: "The Credit Card Number is Incorrect.",
                CardNumber
            }
        }
    }

    // these values are required
    if (!BankId || !NeedyId || !OwnerName || !AccountNumber || !ShebaNumber) {
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            values
        }
    };

    const canAdd = await availableId(connection, BankId, NeedyId)
    if (!canAdd) {
        return {
            status: "Failed",
            msg: "Can't Add with this ID, This ID Doesn't Exist"
        }
    };

    const duplicateUniqueValue = checkDuplicate(connection, {ShebaNumber,AccountNumber,NeedyId} , ws_loadNeedyAccount);
        if (!duplicateUniqueValue) {
            return {
                status: "Failed",
                msg: "Error Updating Row, Duplicate Record",
                uniqueColumn: "ShebaNumber, AccountNumber, NeedyId",
            }
        }


    let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblNeedyAccounts]
        (BankId,NeedyId,OwnerName,CardNumber,AccountNumber,AccountName,ShebaNumber)
        VALUES 
        ('${BankId}','${NeedyId}','${OwnerName}','${CardNumber}','${AccountNumber}','${AccountName}','${ShebaNumber}'); 
        SELECT SCOPE_IDENTITY() AS NeedyAccountId;`

    try {
        const request = pool.request();
        const result = request.query(queryString);
        const id = result.recordset[0].NeedyAccountId;
        return id;

    } catch (err) {
        console.error("ws_createNeedyAccount error:", err)
    }
};


const ws_updateNeedyAccount = async (connection, filters, newValues) => {

    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    const {ShebaNumber , AccountNumber , NeedyId} = newValues;
    if ( ShebaNumber || AccountNumber || NeedyId) {
        const duplicateUniqueValue = checkDuplicate(connection, {ShebaNumber,AccountNumber,NeedyId} , ws_loadNeedyAccount);
        if (!duplicateUniqueValue) {
            return {
                status: "Failed",
                msg: "Error Updating Row, Duplicate Record",
                uniqueColumn: "ShebaNumber, AccountNumber, NeedyId",
                newValues
            }
        }
    };

    if (newValues.CardNumber) {
        CardNumber = newValues.CardNumber;
        const valid = validateCreditCard(String(CardNumber));
        if (!valid) {
            return {
                status: "Failed",
                msg: "The Credit Card Number is Incorrect.",
                CardNumber
            }
        }
    };


    let queryString = `UPDATE [${DB_DATABASE}].[dbo].[tblNeedyAccounts] SET `;

    // update our query string 
    queryString = setToQueryString(queryString, newValues) + " WHERE 1=1 ";
    queryString = normalizeQueryString(queryString, filters);


    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        console.dir(updateResult);
        const table = await ws_loadNeedyAccount(connection);
        return table;
    } catch (err) {
        console.error("SQL error:", err);
    }
};


const ws_deleteNeedyAccount = async (connection, NeedyAccountId , NeedyId , AccountNumber) => {

    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    const canRemove = await checkForeignKey(connection, "tblNeedyAccounts", {NeedyId , AccountNumber});
    if (!canRemove){
        return {
            status: "Failed",
            msg: "Can not remove this ID",
            NeedyAccountId
        };
    }

    await ws_loadNeedyAccount(connection , {NeedyAccountId});


    let queryString = `DELETE [${DB_DATABASE}].[dbo].[tblNeedyAccounts] WHERE NeedyAccountId = ${NeedyAccountId};`

    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString);
        console.dir(deleteResult);

        const tables = await ws_loadNeedyAccount(connection);
        return tables;
    } catch (err) {
        console.log("SQL error: ", err);
    }
};




module.exports = {
    ws_loadNeedyAccount,
    ws_createNeedyAccount,
    ws_updateNeedyAccount,
    ws_deleteNeedyAccount
}