const crypto = require('crypto');
const {normalizeQueryString,setToQueryString,validateNationalCode,checkDuplicate, checkForeignKey} = require("../utils/commonModules");
require("dotenv").config({
    path: "../utils/config.env"
});
const {
    DB_DATABASE
} = process.env



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
        [PersonPhoto],
        [SecretCode] 
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


const ws_createPersonal = async (connection,values,PersonPhoto) => {

    const {pool,poolConnect} = connection;
    await poolConnect;

    // destruct our input values
    const {Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType} = values;

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
    };



    // if the personType is needy we should encrypt it.

    if( PersonType === "3" ){
        

        // these values are required
        if (!Name || !Family || !NationalCode || !IdNumber || !Sex || !BirthDate || !BirthPlace  || !PersonType || !PersonPhoto) {
            return {
                status: "Failed",
                msg: "Fill Parameters Utterly",
                values
            }
        };


        const duplicateId = await checkDuplicate(connection, {NationalCode , PersonType} , ws_loadPersonal);
        if (duplicateId)
            return {
                status: "Failed",
                msg: "Error Creating Row, Duplicate Record",
                uniqueColumn: "NationalCode, PersonType"
            };



        const person = {
            Name ,
            Family,
            NationalCode
        };

        const personString = JSON.stringify(person);
        
        let hashPerson = crypto.createHash( 'sha1' ).update(personString).digest('hex');
        hashPerson = hashPerson.substring(0 , 20);

        let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblPersonal]
        (Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType,PersonPhoto,SecretCode)
        VALUES 
        ('${Name}','${Family}',${NationalCode},${IdNumber},${Sex},${BirthDate},${BirthPlace},${PersonType},CONVERT(varbinary ,'${PersonPhoto}'),'${hashPerson}'); 
        SELECT SCOPE_IDENTITY() AS PersonId;`



        try {
            const request = pool.request();
            const result = await request.query(queryString);
    
            console.dir(result);
            return result;
    
        } catch (err) {
            console.error("SQL error:", err)
        }



    } else{

        
        // these values are required
        if (!Name || !Family || !Sex || !PersonType) {
            return {
                status: "Failed",
                msg: "Fill Parameters Utterly",
                values
            }
        };

        const duplicateId = await checkDuplicate(connection, NationalCode , ws_loadPersonal);
        if (duplicateId)
            return {
                status: "Failed",
                msg: "Error Creating Row, Duplicate Record",
                NationalCode
            };


        let queryString = `INSERT INTO 
            [${DB_DATABASE}].[dbo].[tblPersonal]
            (Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType,PersonPhoto,SecretCode)
            VALUES 
            (N'${Name}',N'${Family}','${NationalCode}','${IdNumber}','${Sex}','${BirthDate}',N'${BirthPlace}','${PersonType}',CONVERT(varbinary ,'${PersonPhoto}'),'${SecretCode}');
            SELECT SCOPE_IDENTITY() AS PersonId;`

          
            try {
                const request = pool.request();
                const result = request.query(queryString);
        
                console.dir(result);
                return result;
        
            } catch (err) {
                console.error("SQL error:", err)
            }
    }

};



const ws_updatePersonal = async (connection , newValues , filters) => {
    
    const {pool,poolConnect} = connection;
    await poolConnect;

    
    if (newValues.NationalCode) {
        const valid = await validateNationalCode(String(newValues.NationalCode));
        if (!valid) {
            return {
                status: "Failed",
                msg: "Your National Code is Incorrect.",
                NationalCode
            }
        }
        const duplicateId = await checkDuplicate(connection, newValues.NationalCode  , ws_loadPersonal);
        if (duplicateId)
            return {
                status: "Failed",
                msg: "Error Updating Row, Duplicate Record",
                uniqueColumns: "NationalCode, PersonType"
            };
    };



  
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

   
    const canRemove = await checkForeignKey(connection, "tblPersonal", PersonId);
    if (!canRemove) return {
        status: "Failed",
        msg: "Can not remove this ID",
        PersonId,
        dependencies: ["tblNeedyAccounts" , "tblPayment" , "tblAssignNeedyToPlans"]
    };

 
    let queryString = `DELETE [${DB_DATABASE}].[dbo].[tblPersonal] WHERE PersonId = ${PersonId};`

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