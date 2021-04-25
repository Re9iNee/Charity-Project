const {
    normalizeQueryString,
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
            notNullColumns: ["PlanName", "PlanNature", "neededLogin"],
            details
        }
    }

    const {
        pool,
        poolConnect
    }
    // ensures that the pool has been created
    await poolConnect;


    let queryString = `INSERT INTO 
    [${DB_DATABASE}].[dbo].[tblPlans] 
    (PlanName, Description, PlanNature, ParentPlanId, Fdate, Tdate, neededLogin, Icon) 
    VALUES (N'${PlanName}', N'${Description}', '${PlanNature}', '${ParentPlanId}', '${Fdate}', '${Tdate}', '${neededLogin}', CONVERT(varbinary, '${Icon}'));
    SELECT SCOPE_IDENTITY() AS charityAccountId;`

    try {
        const request = pool.request();
        const result = request.query(queryString);
        console.dir(result)
        return result;
    } catch (err) {
        console.error("ws_createPlan errro: ", err)
    }

}

module.exports = {
    ws_loadPlan,
    ws_createPlan,
}