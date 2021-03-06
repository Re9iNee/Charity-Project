const {
    normalizeQueryString,
    checkDuplicate,
    checkForeignKey,
    NotNullColumnsFilled
} = require("../utils/commonModules");

require("dotenv").config({
    path: "../utils/.env"
});
const {
    DB_DATABASE
} = process.env

const {
    ws_loadPlan
} = require("./plan");
const {
    ws_loadPersonal
} = require("./personal");



const availableId = async (connection, PlanId, NeedyId) => {


    if (PlanId) {
        const availablePlanId = await ws_loadPlan(connection, {
            PlanId: PlanId
        }, null, 1);
        return !(!availablePlanId.recordset.length);

    } else if (NeedyId) {
        const availablePersonId = await ws_loadPersonal(connection, {
            PersonId: NeedyId
        }, null, 1);
        return !(!availablePersonId.recordset.length);
    }
};




const ws_loadNeedyForPlan = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [AssignNeedyPlanId]
    ,[NeedyId]
    ,assNeedy.[PlanId]
    ,assNeedy.[Fdate]
    ,assNeedy.[Tdate]
    ,[Name]
    ,[Family]
    ,[NationalCode]
    ,[IdNumber]
    ,[Sex]
    ,[BirthDate]
    ,[BirthPlace]
    ,[PersonType]
    ,[PersonPhoto]
    ,[SecretCode]
    ,[PlanName]
    ,[Description]
    ,[PlanNature]
    ,[ParentPlanId]
    ,plans.[Fdate] as 'Plans Fdate'
    ,plans.[Tdate] as 'Plans Tdate'
    ,[neededLogin]

    FROM [${DB_DATABASE}].[dbo].[tblAssignNeedyToPlans] as assNeedy
        INNER JOIN [SabkadV01].[dbo].[tblPersonal] as personal 
            on assNeedy.NeedyId = personal.PersonId
            
        INNER JOIN [SabkadV01].[dbo].[tblPlans] as plans 
            on assNeedy.PlanId = plans.PlanId

    WHERE 1 = 1 `;
    // abmbiguous column names

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
};



const ws_AssignNeedyToPlan = async (connection, details = new Object(null)) => {
    // NOTE: details object should have default value in order not to throw any errors

    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    // destruct our input values
    const {
        NeedyId,
        PlanId,
        Fdate,
        Tdate
    } = details;


    // these values are required (NotNullColumns)

    if (!NotNullColumnsFilled(details, "PlanId", "NeedyId", "Fdate", "Tdate")) {
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            values: details,
            required: ["PlanId", "NeedyId", "Fdate", "Tdate"]
        }
    };

    // check planid and needyid are exist 
    const canAdd = await availableId(connection, PlanId, NeedyId)
    if (!canAdd) {
        return {
            status: "Failed",
            msg: "Can't Add with these IDs, These IDs Doesn't Exist",
            PlanId,
            NeedyId
        }
    };

    // planid and needyid are unique 
    const duplicateId = await checkDuplicate(connection, {
        NeedyId,
        PlanId
    }, ws_loadNeedyForPlan);
    if (duplicateId) {
        return {
            status: "Failed",
            msg: "Error Creating Row, Duplicate Record",
            uniqueColumn: "NeedyId, PlanId"
        };
    }


    // fromDate must be less than the toDate
    // NOTE: Date Format is: YYYY-MM-DD
    const startDate = Fdate.split('-');
    const endDate = Tdate.split('-');

    const numericStartDate = new Date().setFullYear(startDate[0], startDate[1], startDate[2]);
    const numericEndDate = new Date().setFullYear(endDate[0], endDate[1], endDate[2]);

    if (!numericStartDate < numericEndDate) {
        return {
            status: "Failed",
            msg: "ending date must be bigger than initial date",
        }
    };


    // fromDate and toDate form tblAssignNeedyToPlans should be in tblPlan dates range

    //get tblplan items from plan id
    const planList = await ws_loadPlan(connection, {
        PlanId
    }, null, 1);

    //tblPlan dates
    const tblPlanFdate = planList.recordset[0].Fdate;
    const tblPlanTdate = planList.recordset[0].Tdate;
    // NOTE: Date Format is: YYYY-MM-DD
    const tblPlanStartDate = tblPlanFdate.split('-');
    const tblPlanEndDate = tblPlanTdate.split('-');

    const numericPlanStartDate = new Date().setFullYear(tblPlanStartDate[0], tblPlanStartDate[1], tblPlanStartDate[2]);
    const numericPlanEndDate = new Date().setFullYear(tblPlanEndDate[0], tblPlanEndDate[1], tblPlanEndDate[2]);

    if (numericStartDate < numericPlanStartDate || numericEndDate > numericPlanEndDate) {
        return {
            status: "Failed",
            msg: "ending date and initial date must be in tblPlan dates range",
        }
    };



    let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblAssignNeedyToPlans]
        (NeedyId,PlanId,Fdate,Tdate)
        VALUES 
        ('${NeedyId}','${PlanId}','${Fdate}','${Tdate}'); 
        SELECT SCOPE_IDENTITY() AS AssignNeedyPlanId;`

    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;

    } catch (err) {
        console.error("ws_AssignNeedyToPlan error:", err)
    }
};


const ws_deleteNeedyFromPlan = async (connection, AssignNeedyPlanId, PlanId) => {

    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    if (PlanId && !AssignNeedyPlanId) {

        const idList = await ws_loadNeedyForPlan(connection, PlanId);

        const AssignNeedyPlanId = idList.AssignNeedyPlanId;
        const canRemove = await checkForeignKey(connection, "tblAssignNeedyToPlans", AssignNeedyPlanId);
        if (!canRemove)
            return {
                status: "Failed",
                msg: "Can not remove this ID",
                AssignNeedyPlanId,
                dependencies: ["tblCashAssistanceDetail", "tblNonCashAssistanceDetail"]
            };

    } else {
        const canRemove = await checkForeignKey(connection, "tblAssignNeedyToPlans", AssignNeedyPlanId);
        if (!canRemove)
            return {
                status: "Failed",
                msg: "Can not remove this ID",
                AssignNeedyPlanId,
                dependencies: ["tblCashAssistanceDetail", "tblNonCashAssistanceDetail"]
            };
    }


    let queryString = `DELETE [${DB_DATABASE}].[dbo].[tblAssignNeedyToPlans] WHERE AssignNeedyPlanId = ${AssignNeedyPlanId};`

    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString);
        console.dir(deleteResult);

        const tables = await ws_loadNeedyForPlan(connection);
        return tables;
    } catch (err) {
        console.error("SQL error: ", err);
    }
};


module.exports = {
    ws_loadNeedyForPlan,
    ws_AssignNeedyToPlan,
    ws_deleteNeedyFromPlan
}