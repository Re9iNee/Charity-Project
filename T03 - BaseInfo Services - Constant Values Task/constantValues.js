const {
    normalizeQueryString
} = require("../others/commonModules");

exports.ws_loadBaseValue = async (connection, filters, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [CommonBaseDataId]
    ,[CommonBaseTypeId]
    ,[BaseValue]
    ,[BaseCode]
    FROM [SabkadV01].[dbo].[tblCommonBaseData]
    WHERE 1=1`;
    queryString = normalizeQueryString(queryString, filters);
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}


exports.ws_createBaseValue = async (connection, baseCode, baseValue, commonBaseTypeId) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    try {
        if (!baseCode || !baseCode || !commonBaseTypeId)
            throw new Error("Error Creating Row, Fill Parameters Utterly");
        // Select Scope Identity is for returning id of affected row(s)
        let queryString = `INSERT INTO 
        [SabkadV01].[dbo].[tblCommonBaseData]
        (BaseCode, BaseValue, CommonBaseTypeId)
        VALUES 
        ('${baseCode}', '${baseValue}', ${commonBaseTypeId}); 
        SELECT SCOPE_IDENTITY() AS CommonBaseDataId;`;
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("ws_createBaseValue error: ", err);
    }
}