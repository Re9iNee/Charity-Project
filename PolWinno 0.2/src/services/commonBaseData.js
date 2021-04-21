const {
    normalizeQueryString,
    addZero
} = require("../utils/commonModules");

require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env

const ws_loadBaseValue = async (connection, filters, customeQuery = null, resultLimit = 1000) => {
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
    FROM [${DB_DATABASE}].[dbo].[tblCommonBaseData]
    WHERE 1=1`;
    queryString = normalizeQueryString(queryString, filters);
    if (customeQuery)
        queryString += ` ${customeQuery}`
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}


const ws_createBaseValue = async (connection, baseValue, commonBaseTypeId) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;


    let lastCode = 0;
    // Fetch the last BaseCode
    try {
        lastCode = await getLastBaseCode(connection);
        lastCode = lastCode.slice(3);
    } catch (e) {
        lastCode = "000";
    }
    let baseCode = generateBaseCode(lastCode, commonBaseTypeId);

    if (!baseValue || !baseCode || !commonBaseTypeId)
        return {
            status: "Failed",
            msg: "Error Creating Row, Fill Parameters Utterly"
        };
    try {
        // Select Scope Identity is for returning id of affected row(s)
        let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblCommonBaseData]
        (BaseCode, BaseValue, CommonBaseTypeId)
        VALUES 
        ('${baseCode}', N'${baseValue}', ${commonBaseTypeId}); 
        SELECT SCOPE_IDENTITY() AS CommonBaseDataId;`;
        const request = pool.request();
        const result = await request.query(queryString);
        const id = result.recordset[0].CommonBaseDataId;
        return id;
    } catch (err) {
        console.error("ws_createBaseValue error: ", err);
    }
};

async function getLastBaseCode(connection) {
    let code = await ws_loadBaseValue(connection, null, "ORDER BY BaseCode DESC;", 1);
    code = code.recordset[0].BaseCode;
    console.log(code);
    return code;
};

function generateBaseCode(lastCode, commonBaseTypeId) {
    commonBaseTypeId = addZero(commonBaseTypeId, 3)
    let baseCode = addZero(Number(lastCode) + 1, 3)
    baseCode = String(commonBaseTypeId) + String(baseCode);
    return baseCode;
};



const ws_updateBaseValue = async (connection, filters, newValues) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    const {
        commonBaseTypeId,
        baseValue
    } = newValues;
    let queryString = `UPDATE [${DB_DATABASE}].[dbo].[tblCommonBaseData] SET `
    if (commonBaseTypeId && baseValue)
        queryString += ` CommonBaseTypeId = ${commonBaseTypeId}, BaseValue = N'${baseValue}' `;
    else if (baseValue)
        queryString += ` BaseValue = N'${baseValue}'`;
    else if (commonBaseTypeId)
        queryString += ` CommonBaseTypeId = ${commonBaseTypeId}`;

    queryString += " WHERE 1=1 ";
    queryString = normalizeQueryString(queryString, filters);

    console.log(queryString);

    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        // return table records
        const table = await ws_loadBaseValue(connection);
        return table;
    } catch (err) {
        console.error("SQL error: ", err);
    }
};



const ws_deleteBaseValue = async (connection, commonBaseDataId) => {
    const {
        checkForeignKey
    } = require("../utils/commonModules");
    const canRemove = await checkForeignKey(connection, "tblCommonBaseData", commonBaseDataId);
    if (!canRemove) return {
        status: "Failed",
        msg: "Can not remove this ID due to dependency",
        commonBaseDataId
    };
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `DELETE [${DB_DATABASE}].[dbo].[tblCommonBaseData] WHERE CommonBaseDataId = ${commonBaseDataId};`
    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString);
        const table = await ws_loadBaseValue(connection);
        return table;
    } catch (err) {
        console.error("SQL error: ", err)
    }
};



module.exports = {
    ws_loadBaseValue,
    ws_createBaseValue,
    ws_updateBaseValue,
    ws_deleteBaseValue,
}