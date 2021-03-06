const crypto = require('crypto');
const {normalizeQueryString,setToQueryString,validateNationalCode,checkDuplicate, checkForeignKey,NotNullColumnsFilled} = require("../utils/commonModules");
require("dotenv").config({
    path: "../utils/.env"
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
        return {
            status: "Failed",
            method: "ws_loadPersonal",
            msg: err
        }
    }
};


const ws_createPersonal = async (connection,values,PersonPhoto) => {
    // NOTE: because we search using "in" keyword, details should have an default value


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


    // if the personType is needy we use a encrypted key.

    if( PersonType === "3" ){
        

        // these values are required
        if (!( ("Name" && "Family" && "NationalCode" && "IdNumber" && "Sex" && "BirthDate" && "BirthPlace" && "PersonType" ) in values || !PersonPhoto) ){
            return {
                status: "Failed",
                msg: "Fill Parameters Utterly",
                values
            }
        };


        const duplicateId = await checkDuplicate(connection, NationalCode , ws_loadPersonal);
        if (!duplicateId)
            return {
                status: "Failed",
                msg: "Error Creating Row, Duplicate Record",
                uniqueColumn: "NationalCode"
            };



        const person = {
            Name ,
            Family,
            NationalCode
        };

        const personString = JSON.stringify(person);
        
        let hashPerson = crypto.createHash( 'sha1' ).update(personString).digest('hex');
        // FIXME: this doesn't support UTF-8
        
        let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblPersonal]
        (Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType,PersonPhoto,SecretCode)
        VALUES 
        (N'${Name}',N'${Family}','${NationalCode}','${IdNumber}','${Sex}','${BirthDate}',N'${BirthPlace}','${PersonType}',CONVERT(varbinary,'${PersonPhoto}'),'${hashPerson}'); 
        SELECT SCOPE_IDENTITY() AS PersonId;`


        try {
            const request = pool.request();
            const result = await request.query(queryString);
    
            console.dir(result);
            return result;
    
        } catch (err) {
            console.error("SQL error:", err);
            return {
                status: "Failed",
                method: "ws_createPersonal",
                msg: err
            }
        }



    } else{
        // TODO: optimize your codes - make sure that you won't rewrite them again
        // TODO: try using normalizeQueryString_Create && setToQueryString method it will help


        
        // these values are required
        if (!( ("Name" && "Family" && "Sex" && "PersonType") in values)) {
            return {
                status: "Failed",
                msg: "Fill Parameters Utterly",
                values
            }
        };

        const duplicateId = await checkDuplicate(connection, NationalCode , ws_loadPersonal);
        if (!duplicateId)
            return {
                status: "Failed",
                msg: "Error Creating Row, Duplicate Record",
                NationalCode
            };

        
        // NOTE: notice that by rewriting your codes you fixed a problem but you didn't in a pervious "if" statement. (line 130)
        let queryString = `INSERT INTO 
            [${DB_DATABASE}].[dbo].[tblPersonal]
            (Name,Family,NationalCode,IdNumber,Sex,BirthDate,BirthPlace,PersonType,PersonPhoto)
            VALUES 
            (N'${Name}',N'${Family}','${NationalCode}','${IdNumber}','${Sex}','${BirthDate}',N'${BirthPlace}','${PersonType}',CONVERT(varbinary,'${PersonPhoto}'));
            SELECT SCOPE_IDENTITY() AS PersonId;`

            try {
                const request = pool.request();
                const result = await request.query(queryString);
        
                console.dir(result);
                return result;
        
            } catch (err) {
                console.error("SQL error:", err);
                return {
                    status: "Failed",
                    method: "ws_createPersonal",
                    msg: err
                }
            }
    }

};



const ws_updatePersonal = async (connection , newValues , filters) => {
    
    const {pool,poolConnect} = connection;
    await poolConnect;

    const {NationalCode} = newValues;
    
    if (NationalCode) {
        const valid = await validateNationalCode(String(NationalCode));
        if (!valid) {
            return {
                status: "Failed",
                msg: "Your National Code is Incorrect.",
                NationalCode
            }
        }
        const duplicateId = await checkDuplicate(connection, NationalCode  , ws_loadPersonal);
        if (duplicateId)
            return {
                status: "Failed",
                msg: "Error Updating Row, Duplicate Record",
                uniqueColumns: "NationalCode"
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
        return {
            status: "Failed",
            method: "ws_updatePersonal",
            msg: err
        }
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
        return {
            status: "Failed",
            method: "ws_deletePersonal",
            msg: err
        }
    }
};




module.exports = {ws_loadPersonal , ws_createPersonal , ws_updatePersonal , ws_deletePersonal};