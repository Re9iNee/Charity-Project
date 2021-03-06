const {
    normalizeQueryString,
    addZero,
    NotNullColumnsFilled,
    normalizeQueryString_Create
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
        return result;
    } catch (err) {
        console.error("ws_loadBaseValue SQL error: ", err);
    }
}


const ws_createBaseValue = async (connection, details = new Object(null)) => {
    // details are the parameters sent for creating table
    const {
        CommonBaseTypeId,
        BaseValue
    } = details;
    let baseCode = await generateBaseCode(connection, CommonBaseTypeId);
    details.BaseCode = baseCode;
    // Not Null values
    // NOTE: NotNullColumnsFilled params: (obj, [...not null columns])
    if (!NotNullColumnsFilled(details, "BaseValue", "CommonBaseTypeId"))
        return {
            status: "Failed",
            msg: "Error Creating Row, Fill Parameters Utterly"
        };

    // Issue #9
    // Check if commonBaseTypeId exists on commonBaseType table - returns true -> exist ||| false -> doesn't exist 
    const canAdd = await availableTypeId(connection, CommonBaseTypeId)
    if (!canAdd)
        return {
            status: "Failed",
            msg: "Can't Add with this commonTypeId, This ID Doesn't Exist"
        }


    // Select Scope Identity is for returning id of affected row(s)
    let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblCommonBaseData]
        ($COLUMN)
        VALUES 
        ($VALUE); 
        SELECT SCOPE_IDENTITY() AS CommonBaseDataId;`;


    queryString = normalizeQueryString_Create(queryString, details);

    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        const id = result.recordset[0].CommonBaseDataId;
        return id;
    } catch (err) {
        console.error("ws_createBaseValue error: ", err);
    }
};

async function availableTypeId(connection, commonBaseTypeId) {
    const {
        ws_loadBaseType
    } = require("./commonBaseType");
    const availableTypeId = await ws_loadBaseType(connection, {
        CommonBaseTypeId: commonBaseTypeId
    }, null, 1);
    return !(!availableTypeId.recordset.length);
}

async function getLastBaseCode(connection) {
    let code = await ws_loadBaseValue(connection, null, "ORDER BY CommonBaseDataId DESC;", 1);
    code = code.recordset[0].BaseCode;
    return code;
};

async function generateBaseCode(connection, commonBaseTypeId) {

    let lastCode = "000";
    // Fetch the last BaseCode
    try {
        lastCode = await getLastBaseCode(connection);
        lastCode = lastCode.slice(3);
    } catch (e) {
        lastCode = "000";
    }

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


    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        // return table records
        const table = await ws_loadBaseValue(connection);
        return table;
    } catch (err) {
        console.error("ws_updateBaseValue SQL error: ", err);
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
        console.error("ws_deleteBaseValue SQL error: ", err)
    }
};



module.exports = {
    ws_loadBaseValue,
    ws_createBaseValue,
    ws_updateBaseValue,
    ws_deleteBaseValue,
}