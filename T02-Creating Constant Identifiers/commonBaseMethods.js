/* 
1. Why Using Connection Pool?
 - We don't want to overhead database with so many connections. we open one use it for multiple Queries. then close() connection when we don't need it.
2. Why resultLimit? 
 - It is recommended to use SELECT TOP $(int) instead of Selecting and returning Everything from database.

3. Why Scope Identity?
 - SQL Insertion won't return Id of the affected row. so by using SELCET Query right after insertion we can use CommonBaseTypeId and the return it.
*/


const {normalizeQueryString, toHex, toInt} = require("../others/commonModules");



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
        console.dir(result)
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}


// Task 02 Method 02
const ws_createBaseType = async (connection, baseTypeTitle) => {
    // read last baseCode from table and create hex index then insert into table
    const lastBaseCode = await getLastBaseCode(connection);
    let baseTypeCode = toHex(lastBaseCode + 1);
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    try {
        if (!baseTypeTitle || !baseTypeCode)
            throw new Error("Error Creating Row, Fill Parameters Utterly");
        /* Select Scope Identity is for returning id of affected row(s) */
        let queryString = `INSERT INTO 
        [SabkadV01].[dbo].[tblCommonBaseType] (BaseTypeTitle, BaseTypeCode) VALUES ('${baseTypeTitle}', ${baseTypeCode}); SELECT SCOPE_IDENTITY() AS CommonBaseTypeId;`;
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        const id = result.recordset[0].CommonBaseTypeId;
        return id;
    } catch (err) {
        console.error("ws_createBaseType error: ", err)
    }
}
async function getLastBaseCode(connection){
    let code = await ws_loadBaseType(connection, null, "ORDER BY BaseTypeCode DESC;", 1);
    code = code.recordset[0].BaseTypeCode;
    code = toInt(code);
    return code;
}


module.exports = {
    ws_loadBaseType,
    ws_createBaseType,
}