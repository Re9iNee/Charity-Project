const {
    normalizeQueryString,
    normalizeQueryString_Create,
    checkDuplicate,
    sqlDate,
    endIsLenghty,
} = require("../utils/commonModules");


require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env;

const ws_loadPlan = async (connection, filters, customQuery = null, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [PlanId]
    ,[PlanName]
    ,[Description]
    ,[PlanNature]
    ,[ParentPlanId]
    ,[Icon]
    ,[Fdate]
    ,[Tdate]
    ,[neededLogin]
    FROM [${DB_DATABASE}].[dbo].[tblPlans] WHERE 1 = 1 `;
    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}

const ws_createPlan = async (connection, details) => {
    // details are the parameters sent for creating table

    const {
        PlanName,
        Description,
        PlanNature,
        ParentPlanId,
        Icon,
        Fdate,
        Tdate,
        neededLogin
    } = details;

    // Not Null Values
    if (!PlanName) {
        // Other Not Null Columns that actually have an default values => PlanNature - neededLogin
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            required: ["PlanName", "PlanNature", "neededLogin"],
            details
        }
    }

    // Unique Values
    // check for duplicates - returns: true -> duplicate | false -> unique
    const duplicateUniqueValue = await checkDuplicate(connection, {
        PlanName,
        PlanNature,
        ParentPlanId
    }, ws_loadPlan);
    if (duplicateUniqueValue)
        return {
            status: "Failed",
            msg: "Error Creating Row, Violation of unique values",
            uniqueColumn: "ParentPlanId, PlanNature, PlanName",
            details
        }


    // Date format: YYYY-MM-DD
    // Fdate = Shuru
    // Tdate = Payan
    let start = new sqlDate(Fdate.split('-'));
    let end = new sqlDate(Tdate.split('-'));
    // compare end date and start date - returns: true -> end is bigger or at the same date || false -> start is bigger.
    if (!endIsLenghty(start, end))
        return {
            status: "Failed",
            msg: "ending date must be bigger than initial date",
            start,
            end
        }

    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;


    let queryString = `INSERT INTO 
    [${DB_DATABASE}].[dbo].[tblPlans] 
    ($COLUMN) 
    VALUES ($VALUE);
    SELECT SCOPE_IDENTITY() AS planId;`
    // normalizeQS_Create => (queryString, {planName: "sth"}, ...configs)
    // configs are the exceptions that don't have normal values. (need to convert or something to insert into SQL Server)
    // configs = {onColumn: "EXCEPTION COLUMN", prefix="e.g: CONVERT(INT, $1)"}
    queryString = normalizeQueryString_Create(queryString, details, {
        onColumn: "Icon",
        prefix: "CONVERT(varbinary, '$1')"
    })
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        const id = result.recordset[0].planId;
        return id;
    } catch (err) {
        console.error("ws_createPlan error: ", err)
    }

}


const ws_updatePlan = async (connection, filters, newValues) => {
    // note: inputs && parameters -> PlanName, Description, PlanNature, ParentPlanId, icon, Fdate, Tdate, neededLogin, PlanId
    // Unique Values => (PlanName, PlanNature, ParentPlanId)
    if (PlanName || PlanNature || ParentPlanId) {
        // check for unique values if they've entered.
        const duplicateUniqueValue = await checkDuplicate(connection, {
            PlanName,
            PlanNature,
            ParentPlanId
        }, ws_loadPlan);
        console.log(duplicateUniqueValue)
        if (duplicateUniqueValue)
            return {
                status: "Failed",
                msg: "Error Updating Row, Violation of unique values",
                uniqueColumn: "ParentPlanId, PlanNature, PlanName",
                newValues
            }
    }
    // todo: if PlanId exists in these table => (tblCashAssistanceDetail, tblNonCashAssistanceDetails) we can not update/change PlanNature Column.
    // todo: if Planid exists in this table => (tblAssignNeedyToPlans) we can not update/change Fdate && Tdate column.
    // todo: ending time must be lenghty er than start time
    // todo: return the table
}


module.exports = {
    ws_loadPlan,
    ws_createPlan,
    ws_updatePlan,
}