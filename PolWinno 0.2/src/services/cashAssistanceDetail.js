const {
    normalizeQueryString,
    checkDuplicate,
    normalizeQueryString_Create,
} = require("../utils/commonModules");


require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env

const ws_loadCashAssistanceDetail = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
    // in older version of this code. filters object hadn't any default value - Issue #42 - filters object should not be empty
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
    ,cashAssist.[Description] as "Cash Assist Description"
    ,[NeedyId]
    ,assignNeedy.[Fdate]
    ,assignNeedy.[Tdate]
    ,[PersonId]
    ,[Name]
    ,[Family]
    ,[NationalCode]
    ,[SecretCode]
    ,[PlanName]
    ,plans.[Description] as "Plans Description"
    ,[PlanNature]
    ,[ParentPlanId]
    FROM [${DB_DATABASE}].[dbo].[tblCashAssistanceDetail] as cashAssist 
    INNER JOIN [${DB_DATABASE}].[dbo].[tblPlans] as plans
    on cashAssist.PlanId = plans.PlanId
    LEFT JOIN [${DB_DATABASE}].[dbo].[tblAssignNeedyToPlans] as assignNeedy
    on cashAssist.AssignNeedyPlanId = assignNeedy.AssignNeedyPlanId
    LEFT JOIN [${DB_DATABASE}].[dbo].[tblPersonal] as personal
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
    // if MinPrice was empty default will be "0"
    if (!("MinPrice" in details)) {
        details.MinPrice = 0;
    }
    // details are the parameters sent for creating table
    const {
        AssignNeedyPlanId,
        PlanId,
        NeededPrice,
        MinPrice,
        Description
    } = details;

    // Not Null Values
    if (!("PlanId" in details) || !("NeededPrice" in details))
        return {
            status: "FAILED",
            msg: "Fill Parameters Utterly.",
            details,
            notNullValues: ["PlanId", "NeededPrice"]
        }





    // check for duplicates (check for unique columns)
    // AssignNeedyPlanId and PlanId are unqiue values
    const duplicateUniqueValue = await checkDuplicate(connection, {
        AssignNeedyPlanId,
        PlanId
    }, ws_loadCashAssistanceDetail);
    if (duplicateUniqueValue)
        return {
            status: "Failed",
            msg: "Error Creating Row, Violation of unique values",
            uniqueColumn: "AssignNeedyPlanId, PlanId",
            details
        }

    // check for any column custome validations
    // MinPrice should be less or equal than NeededPrice
    if (MinPrice > NeededPrice)
        return {
            status: "Failed",
            msg: "Error Creating Row, NeededPrice should be greater than MinPrice",
            details
        }


    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblCashAssistanceDetail] 
        ($COLUMN)
        VALUES ($VALUE);
        SELECT SCOPE_IDENTITY() AS cashAssistanceDetailId;`
    // normalizeQS_Cretate => (queryString, {PlanId: "sth"}, ...configs)
    queryString = normalizeQueryString_Create(queryString, details);

    try {
        const request = pool.request();
        const result = await request.query(queryString);
        const id = result.recordset[0].cashAssistanceDetailId;
        return id;
    } catch (err) {
        console.error("ws_createCashAssistanceDetail error: ", err);
    }
}


const ws_updateCashAssistanceDetail = async (connection, filters, newValues) => {
    // if MinPrice was empty default will be "0"
    if (!("MinPrice" in newValues)) {
        newValues.MinPrice = 0;
    }
    // inputs and params
    const {
        AssignNeedyPlanId,
        PlanId,
        NeededPrice,
        MinPrice,
        Description
    } = newValues;
    // MinPrice should be less or equal than NeededPrice
    if (MinPrice > NeededPrice)
        return {
            status: "Failed",
            msg: "Error Updating Row, NeededPrice should be greater than MinPrice",
            details
        }

    // todo: if CashAssistanceDetailId is available on tblPayment we can not change MinPrice AND NeededPrice

    // todo: check for duplicates (check for unique columns)
    // todo: AssignNeedyPlanId and PlanId are unqiue values - make sure if you enter one of them it will work


}

module.exports = {
    ws_loadCashAssistanceDetail,
    ws_createCashAssistanceDetail,
    ws_updateCashAssistanceDetail,
}