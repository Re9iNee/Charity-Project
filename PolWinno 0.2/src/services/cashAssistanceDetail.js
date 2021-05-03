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
    // Ambiguous column names problem
    if ("PlanId" in filters) {
        filters["plans.PlanId"] = filters.PlanId;
        delete filters.PlanId;
    }
    if ("AssignNeedyPlanId" in filters) {
        filters["cashAssist.AssignNeedyPlanId"] = filters.AssignNeedyPlanId;
        delete filters.AssignNeedyPlanId;
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
        console.error("SQL error: ", err);
    }
}




const ws_createCashAssistanceDetail = async (connection, details) => {
    // details are the parameters sent for creating table
    const {
        AssignNeedyPlanId,
        PlanId,
        NeededPrice,
        MinPrice,
        Description
    } = details;

    // check inserted for not null values (check not null values)
    // todo: if MinPrice was empty default will be "0"



    // check for duplicates (check for unique columns)
    // todo: assignNeedyPlanId and PlanId are unqiue values



    // check for any column custome validations
    // todo: MinPrice should be less or equal than NeededPrice


    // put 'N' before any given string.
}


module.exports = {
    ws_loadCashAssistanceDetail,

}