const {
    normalizeQueryString
} = require("../utils/commonModules");

require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env
const ws_loadNeedyForPlan = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
    // filters object should not be empty - Issue #42
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (1000) [AssignNeedyPlanId]
    ,[NeedyId]
    ,assNeedy.[PlanId]
    ,assNeedy.[Fdate]
    ,assNeedy.[Tdate]
    ,[PersonId]
    ,[Name]
    ,[Family]
    ,[NationalCode]
    ,[IdNumber]
    ,[Sex]
    ,[BirthDate]
    ,[BirthPlace]
    ,[PersonType]
    ,[SecretCode]
    ,[PlanName]
    ,[Description]
    ,[PlanNature]
    ,[ParentPlanId]
    ,plans.[Fdate] as 'Plans Fdate'
    ,plans.[Tdate] as 'Plans Tdate'
    ,[neededLogin]
    FROM [SabkadV01].[dbo].[tblAssignNeedyToPlans] as assNeedy INNER JOIN
    [SabkadV01].[dbo].[tblPersonal] as personal 
    on assNeedy.NeedyId = personal.PersonId
    INNER JOIN [SabkadV01].[dbo].[tblPlans] as plans 
    on assNeedy.PlanId = plans.PlanId
    WHERE 1 = 1 `;
    // Ambiguous column names
    if ("NeedyId" in filters) {
        filters["assNeedy.NeedyId"] = filters.NeedyId;
        delete filters.NeedyId;
    }
    if ("PlanId" in filters) {
        filters["plans.PlanId"] = filters.PlanId;
        delete filters.PlanId;
    }
    
    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`;
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("ws_loadNeedyForPlan table - SQL Error: ", err)
    }
}

module.exports = {
    ws_loadNeedyForPlan
}