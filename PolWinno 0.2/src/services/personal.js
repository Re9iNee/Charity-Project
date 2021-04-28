const crypto = require('crypto');
const {normalizeQueryString,setToQueryString} = require("../utils/commonModules");
const validateNationalCode = require('../utils/nationalCard');



const checkDuplicateId = async(connection, IdNumber) => {

    let result = await ws_loadPersonal(connection, {
        IdNumber
    }, null, 1);
    
    let duplicate = !(!result.recordset.length);
    return duplicate;
};




const ws_loadPersonal = async (connection, filters, customeQuery = null, resultLimit = 1000) => {

    //connection set
    const {pool , poolConnect} = connection; 
    await poolConnect;

    //get all datas from ppersonal table
    let queryString = `SELECT TOP (${resultLimit}) [PersonId],
        [Name], 
        [Family], 
        [NationalCode], 
        [IdNumber], 
        [Sex], 
        [BirthDate], 
        [BirthPlace], 
        [PersonType], 
        [PersonPhoto] 
    FROM [${DB_DATABASE}].[dbo].[tblPersonal]
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
        console.error("SQL error: ", err);
    }
};


const ws_createPersonal = async (connection,values) => {

    const {pool,poolConnect} = connection;
    await poolConnect;

    // destruct our input values
    const {Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType,PersonPhoto} = values;

    // national card validation
    if (NationalCode) {
        const valid = validateNationalCode(String(NationalCode));
        if (!valid) {
            return {
                status: "Failed",
                msg: "Your National Code is Incorrect.",
                CardNumber
            }
        }
    }

    // these values are required
    if (!Name || !Family || !Sex || !PersonType) {
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            values
        }
    };

    let queryString = `INSERT INTO 
        [SabkadV01].[dbo].[tblPersonal]
        (Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType,PersonPhoto)
        VALUES 
        ('${Name}','${Family}',${NationalCode},${IdNumber},${Sex},${BirthDate},${BirthPlace},${PersonType},${PersonPhoto}); 
        SELECT SCOPE_IDENTITY() AS PersonId;`

    try {
        const request = pool.request();
        const result = request.query(queryString);

        console.dir(result);
        return result;

    } catch (err) {
        console.error("ws_createPersonal error:", err)
    }

};


const ws_updatePersonal = async (connection , filters , newValues) => {
    
    const {pool,poolConnect} = connection;
    await poolConnect;

    if (newValues.IdNumber) {
        const DuplicateId = await checkDuplicateId(connection, newValues.IdNumber);
        if (DuplicateId)
            return {
                status: "Failed",
                msg: "Error Creating Row, Duplicate IdNumber",
                ...newValues.IdNumber,
            };
    }

    
    let queryString = `UPDATE [${DB_DATABASE}].[dbo].[tblPersonal] SET `;

    // update our query string
    queryString = setToQueryString(queryString, newValues) + "WHERE 1=1";
    queryString = normalizeQueryString(queryString, filters);

    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        console.dir(updateResult);
        const table = await ws_loadPersonal(connection);
            return table;
    } catch (err) {
        console.error("SQL error:", err);
    }

};


const ws_deletePersonal = async (connection, PersonId) => {

    const {pool,poolConnect} = connection;
    await poolConnect;

   
    await ws_loadPersonal(connection, {
        PersonId
    });

 
    let queryString = `DELETE [SabkadV01].[dbo].[tblPersonal] WHERE PersonId = ${PersonId};`

    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString);
        console.dir(deleteResult);

        const table = await ws_loadPersonal(connection);
        return table;
    } catch (err) {
        console.log("SQL error: ", err);
    }
};




module.exports = {ws_loadPersonal , ws_createPersonal , ws_updatePersonal , ws_deletePersonal};