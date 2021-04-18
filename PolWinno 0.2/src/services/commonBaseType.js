/* 
1. Why Using Connection Pool?
 - We don't want to overhead database with so many connections. we open one use it for multiple Queries. then close() connection when we don't need it.
2. Why resultLimit? 
 - It is recommended to use SELECT TOP $(int) instead of Selecting and returning Everything from database.

3. Why Scope Identity?
 - SQL Insertion won't return Id of the affected row. so by using SELCET Query right after insertion we can use CommonBaseTypeId and the return it.
*/


const {
    normalizeQueryString,
    toHex,
    toInt
} = require("../utils/commonModules");



// Task 02 Method 01
const ws_loadBaseType = async (connection, filters, costumeQuery = null, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [CommonBaseTypeId]
    ,[BaseTypeTitle]
    ,[BaseTypeCode] 
    FROM [SabkadV01].[dbo].[tblCommonBaseType]
    WHERE 1=1`
    queryString = normalizeQueryString(queryString, filters)
    if (costumeQuery)
        queryString += ` ${costumeQuery}`
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
};


// Task 02 Method 02
const ws_createBaseType = async (connection, baseTypeTitle) => {
    // read last baseCode from table and create hex index then insert into table
    const lastBaseCode = await getLastBaseCode(connection);
    let baseTypeCode = toHex(lastBaseCode + 1);
    if (!baseTypeTitle)
        return {
            status: "Failed",
            msg: "Error Creating Row, Fill Parameters Utterly"
        };
    // check for baseTypeTitle duplicates - returns: true -> duplicate | false -> unique
    const duplicateBaseTypeTitle = await checkDuplicateTitle(connection, baseTypeTitle);
    if (duplicateBaseTypeTitle)
        return {
            status: "Failed",
            msg: "Error Creating Row, Duplicate BaseTypeTitle",
            baseTypeTitle
        };
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    try {
        /* Select Scope Identity is for returning id of affected row(s) */
        let queryString = `INSERT INTO 
        [SabkadV01].[dbo].[tblCommonBaseType] (BaseTypeTitle, BaseTypeCode) VALUES ('${baseTypeTitle}', '${baseTypeCode}'); SELECT SCOPE_IDENTITY() AS CommonBaseTypeId;`;
        const request = pool.request();
        const result = await request.query(queryString);
        const id = result.recordset[0].CommonBaseTypeId;
        return id;
    } catch (err) {
        console.error("ws_createBaseType error: ", err)
    }
};
async function checkDuplicateTitle(connection, baseTypeTitle) {
    let result = await ws_loadBaseType(connection, {
        BaseTypeTitle: baseTypeTitle
    }, null, 1);
    // 0 -> unique 
    // 1 -> duplicate
    let duplicate = !(!result.recordset.length);
    return duplicate;
}
async function getLastBaseCode(connection) {
    let code = await ws_loadBaseType(connection, null, "ORDER BY BaseTypeCode DESC;", 1);
    code = code.recordset[0].BaseTypeCode;
    code = toInt(code);
    return code;
};


const ws_updateBaseType = async (connection, filters, newBaseTypeTitle) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `UPDATE [SabkadV01].[dbo].[tblCommonBaseType] SET BaseTypeTitle = '${newBaseTypeTitle}' WHERE 1=1 `
    queryString = normalizeQueryString(queryString, filters)
    // check for baseTypeTitle duplicates - returns: true -> duplicate | false -> unique
    const duplicateBaseTypeTitle = await checkDuplicateTitle(connection, newBaseTypeTitle);
    if (duplicateBaseTypeTitle)
        return {
            status: "Failed",
            msg: "Error Updating Row, Duplicate BaseTypeTitle",
            newBaseTypeTitle
        };
    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        const table = await ws_loadBaseType(connection)
        return table;
    } catch (err) {
        console.error("SQL error: ", err);
    }
};


const ws_deleteBaseType = async (connection, commonBaseTypeId) => {
    const {
        ws_loadBaseValue
    } = require("./commonBaseData");
    const result = await ws_loadBaseValue(connection, {
        CommonBaseTypeId: commonBaseTypeId
    });
    const canRemove = !result.recordset.length;
    if (!canRemove) return {
        status: "Failed",
        msg: `Can't Drop row with the id of ${commonBaseTypeId}, commonBaseData Table Depends on it.`
    }
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `DELETE [SabkadV01].[dbo].[tblCommonBaseType] WHERE CommonBaseTypeId = ${commonBaseTypeId};`
    try {
        const request = pool.request();
        const DeleteResult = await request.query(queryString);
        const table = ws_loadBaseType(connection);
        return table;
    } catch (err) {
        console.error("SQL error: ", err)
    }
};


module.exports = {
    ws_loadBaseType,
    ws_createBaseType,
    ws_updateBaseType,
    ws_deleteBaseType,
}