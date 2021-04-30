const {
    normalizeQueryString,
} = require("../utils/commonModules");


require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env

const ws_loadCashAssistanceDetail = async (connection, filters, customQuery = null, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (1000) [CashAssistanceDetailId]
    ,cashAssist.[AssignNeedyPlanId]
    ,cashAssist.[PlanId]
    ,[NeededPrice]
    ,[MinPrice]
    ,cashAssist.[Description]
    ,[NeedyId]
    ,assignNeedy.[Fdate]
    ,assignNeedy.[Tdate]
    ,[PersonId]
    ,[Name]
    ,[Family]
    ,[NationalCode]
    ,[SecretCode]
    ,[PlanName]
    ,plans.[Description]
    ,[PlanNature]
    ,[ParentPlanId]
    FROM [${DB_DATABASE}].[dbo].[tblCashAssistanceDetail] as cashAssist INNER JOIN
    [${DB_DATABASE}].[dbo].[tblAssignNeedyToPlans] as assignNeedy 
    on cashAssist.AssignNeedyPlanId = assignNeedy.AssignNeedyPlanId
    INNER JOIN [${DB_DATABASE}].[dbo].[tblPlans] as plans 
    on cashAssist.PlanId = plans.PlanId
    INNER JOIN [${DB_DATABASE}].[dbo].[tblPersonal] as personal
    on assignNeedy.NeedyId = personal.PersonId 
    WHERE 1 = 1 `;
    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`;

    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
    }
}




module.exports = {
    ws_loadCashAssistanceDetail,
    
}