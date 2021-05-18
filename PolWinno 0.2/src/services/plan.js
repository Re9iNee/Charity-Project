const {
    normalizeQueryString,
    normalizeQueryString_Create,
    checkDuplicate,
    sqlDate,
    endIsLenghty,
    NotNullColumnsFilled,
} = require("../utils/commonModules");

require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env;

const ws_loadPlan = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
    // NOTE because we use "in" keyword to search in filters object, it can not be empty
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
    // NOTE fixed Issue #38 - converting text to varchar
    if ("Description" in filters) {
        filters["CONVERT(VARCHAR(MAX), Description)"] = filters.Description;
        delete filters.Description;
    }
    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        return result;
    } catch (err) {
        console.error("SQL error: ", err);
        return {
            status: "Failed",
            method: "ws_loadPlan",
            msg: err
        }
    }
}

const ws_createPlan = async (connection, details = new Object(null)) => {
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
    if (!NotNullColumnsFilled(details, "PlanName")) {
        // Other Not Null Columns that actually have an default values => PlanNature - neededLogin
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            required: ["PlanName", "PlanNature", "neededLogin"],
            note: "required columns that have default value: PlanNature - neededLogin",
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


    if ("Fdate" in details && "Tdate" in details) {
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
        return {
            status: "Failed",
            method: "ws_createPlan",
            msg: err
        }
    }

}

// NOTE Bulk update is disabled on this table - due to issue #41
const ws_updatePlan = async (connection, filters = new Object(null), newValues = new Object(null)) => {
    // NOTE Because we are searching using "in" keyword filters & newValues object should not be null
    // note: inputs && parameters -> PlanName, Description, PlanNature, ParentPlanId, icon, Fdate, Tdate, neededLogin, PlanId

    // check for duplicates - returns: true -> duplicate | false -> unique
    // Unique Values => (PlanName, PlanNature, ParentPlanId)
    // NOTE Fix Issue #41
    if ("PlanName" in newValues || "PlanNature" in newValues || "ParentPlanId" in newValues) {
        // check for unique values if they've entered.
        let filteredRow = await ws_loadPlan(connection, filters);
        let filteredVals = {
            ParentPlanId: filteredRow.recordset[0].ParentPlanId,
            PlanNature: filteredRow.recordset[0].PlanNature,
            PlanName: filteredRow.recordset[0].PlanName
        }
        let config = {
            PlanName: ("PlanName" in newValues) ? newValues.PlanName : filteredVals.PlanName,
            ParentPlanId: ("ParentPlanId" in newValues) ? newValues.ParentPlanId : filteredVals.ParentPlanId,
            PlanNature: ("PlanNature" in newValues) ? newValues.PlanNature : filteredVals.PlanNature
        }
        const duplicateUniqueValue = await checkDuplicate(connection, config, ws_loadPlan);
        if (duplicateUniqueValue)
            return {
                status: "Failed",
                msg: "Error Updating Row, Violation of unique values",
                uniqueColumn: "ParentPlanId, PlanNature, PlanName",
                newValues,
                "original values of this row": filteredVals
            }
    }
    // BUG: Issue #41
    // if PlanId exists in these table => (tblCashAssistanceDetail, tblNonCashAssistanceDetails) we can not update/change PlanNature Column.
    if ("PlanNature" in newValues) {
        const {
            ws_loadCashAssistanceDetail
        } = require("./cashAssistanceDetail")
        let planIdExist = null;
        // get the PlanId base on the filters object. (load table based on filters object and get their planIds)
        const result = await ws_loadPlan(connection, filters, "ORDER BY PlanId ");
        for (let record of result.recordset) {
            // check for duplicates on dependent tables. if it doesn't have any conflicts UPDATE!
            let PlanId = record.PlanId;
            // checkPlanId in cashAssistanceDetails table - returns true -> if planId exists || false -> planId doesn't Exist.
            // check for duplicates - returns: true -> duplicate | false -> unique
            planIdExist = planIdExist || await checkDuplicate(connection, {
                PlanId
            }, ws_loadCashAssistanceDetail);
            // todo: also check PlanId in nonCashAssistanceDetails table (This table doesn't exists at this point)
            if (planIdExist) break;
        }

        if (planIdExist) {
            return {
                status: "Failed",
                msg: "Error Updating Row, Can not change PlanNature due to PlanId depends on cashAssistanceDetail and nonCashAssistanceDetails tables",
                dependencies: ["cashAssistanceDetails", "nonCashAssistanceDetails"],
                PlanNature,
                "PlanId": filters.PlanId
            }
        }
    }


    if ("Fdate" in newValues && "Tdate" in newValues) {
        // ending time must be lenghty er than start time
        // Date format: YYYY-MM-DD
        // Fdate = Shuru
        // Tdate = Payan
        // if Fdate and Tdate has been inserted.
        let start = new sqlDate(newValues.Fdate.split('-'));
        let end = new sqlDate(newValues.Tdate.split('-'));
        // compare end date and start date - returns: true -> end is bigger or at the same date || false -> start is bigger.
        if (!endIsLenghty(start, end))
            return {
                status: "Failed",
                msg: "ending date must be bigger than initial date",
                start,
                end
            }


        // if Planid exists in this table => (tblAssignNeedyToPlans) we can not update/change Fdate && Tdate column.
        const {
            ws_loadNeedyForPlan
        } = require("./assignNeedyToPlans");
        let planIdExist;
        // get the PlanId base on the filters object. (load table based on filters object and get their PlanId s)
        const result = await ws_loadPlan(connection, filters, "ORDER BY PlanId ");
        for (let record of result.recordset) {
            // check for duplicates on dependent tables. if it doesn't have any conflicts UPDATE!
            let PlanId = record.PlanId;
            // check for duplicates - returns: true -> duplicate | false -> unique
            planIdExist = planIdExist || await checkDuplicate(connection, {
                PlanId
            }, ws_loadNeedyForPlan);
            if (planIdExist) break;
        }
        if (planIdExist)
            return {
                status: "Failed",
                msg: "Error Updating Row, Can not change Fdate nor Tdate due to PlanId column on assignNeedyToPlans table depends on it.",
                dependencies: ["assignNeedyToPlans"],
                filters,
                newValues
            }
    } else if (newValues.Fdate || newValues.Tdate) {
        return {
            status: "Failed",
            msg: "Send Both Parameters Fdate And Tdate",
            newValues,
            Fdate: newValues.Fdate,
            Tdate: newValues.Tdate,
        }
    }



    let queryString = `UPDATE [${DB_DATABASE}].[dbo].[tblPlans] SET `
    const {
        setToQueryString
    } = require("../utils/commonModules")
    // setToQueryString returns: Update ... SET sth = 2, test = 3
    queryString = setToQueryString(queryString, newValues) + " WHERE 1=1 ";
    queryString = normalizeQueryString(queryString, filters);

    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    try {
        const request = pool.request();
        const updateResult = await request.query(queryString);
        // return table records
        const table = await ws_loadPlan(connection);
        return table;
    } catch (err) {
        console.error("ws_updatePlan - SQL  error: ", err);
        return {
            status: "Failed",
            method: "ws_updatePlan",
            msg: err
        }
    }
}

const ws_deletePlan = async (connection, planId) => {
    // if PlanId exists on => tblAssignNeedyToPlans & tblCashAssistanceDetail & tblNonCashAssistanceDetail we can not delete a row with the id of PlanId

    // todo: nonCashAssistanceTable doesn't exist at this point. create and check planId for this table
    const {
        checkForeignKey
    } = require("../utils/commonModules");
    const canRemove = await checkForeignKey(connection, "tblPlans", planId);
    if (!canRemove) return {
        status: "Failed",
        msg: "Can not remove this ID",
        PlanId: planId,
        dependencies: ["tblCashAssistanceDetail", "tblNonCashAssistanceDetail", "tblAssignNeedyToPlans"]
    };

    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `DELETE [${DB_DATABASE}].[dbo].[tblPlans] WHERE PlanId = ${planId};`
    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString);
        const table = await ws_loadPlan(connection);
        return table;
    } catch (err) {
        console.error("ws_deletePlan - SQL error: ", err);
        return {
            status: "Failed",
            method: "ws_deletePlan",
            msg: err
        }
    }
}
module.exports = {
    ws_loadPlan,
    ws_createPlan,
    ws_updatePlan,
    ws_deletePlan
}