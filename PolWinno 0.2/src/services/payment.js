const {
    normalizeQueryString,
    normalizeQueryString_Create,
    setToQueryString,
} = require("../utils/commonModules");

require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env;


const paymentStatusMsg = {
    success: "Successful",
    fail: "Failed"
}

const ws_loadPayment = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
    // in older version of this code. filters object hadn't any default value - Issue #42 - filters object should not be empty
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [PaymentId]
    ,[DonatorId]
    ,payment.[CashAssistanceDetailId]
    ,[PaymentPrice]
    ,[PaymentGatewayId]
    ,[PaymentDate]
    ,[PaymentTime]
    ,[PaymentStatus]
    ,[SourceAccountNumber]
    ,[TargetAccountNumber]
    ,payment.[CharityAccountId]
    ,[FollowCode]
    ,[NeedyId]
    ,[BankID]
    ,[BranchName]
    ,[OwnerName]
    ,[CardNumber]
    ,[AccountNumber]
    ,[AccountName]
    ,[AssignNeedyPlanId]
    ,plans.[PlanId]
    ,[NeededPrice]
    ,[MinPrice]
    ,cashAssist.[Description] as "Cash Assistance Description"
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
    ,plans.[Description] as "Plans Description"
    ,[PlanNature]
    ,[ParentPlanId]
    ,[Fdate]
    ,[Tdate]
    ,[neededLogin]
    FROM [${DB_DATABASE}].[dbo].[tblPayment] as payment INNER JOIN
    [${DB_DATABASE}].[dbo].[tblCharityAccounts] as charityAccounts
    on payment.CharityAccountId = charityAccounts.CharityAccountId
    INNER JOIN [${DB_DATABASE}].[dbo].[tblCashAssistanceDetail] as cashAssist
    on payment.CashAssistanceDetailId = cashAssist.CashAssistanceDetailId
    INNER JOIN [${DB_DATABASE}].[dbo].[tblPlans] as plans
    on plans.PlanId = cashAssist.PlanId
    INNER JOIN [${DB_DATABASE}].[dbo].[tblPersonal] as personal
    on payment.NeedyId = personal.PersonId WHERE 1 = 1 `

    // inputs: CashAssistanceDetailId, PaymentGatewayId, PaymentDate, PaymentStatus, CharityAccountId, FollowCode, NeedyId, PaymentId

    // Ambiguous columns: CashAssistanceDetailId, CharityAccountId
    // Ambiguous column names problem
    if ("CashAssistanceDetailId" in filters) {
        filters["payment.CashAssistanceDetailId"] = filters.CashAssistanceDetailId;
        delete filters.CashAssistanceDetailId;
    }
    if ("CharityAccountId" in filters) {
        filters["filters.CharityAccountId"] = filters.CharityAccountId;
        delete filters.CharityAccountId;
    }

    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`;

    try {
        const request = pool.request();
        const result = await request.query(queryString);
        return result;
    } catch (err) {
        console.error("SQL error: ", err)
    }
}


const ws_payment = async (connection, details = new Object(null)) => {
    // details are the parameters sent for creating table
    // TODO: this method written based on Mrs.Vahidi messages not Documents. This method will be completed via Settlement file.

    // parameters and inputs: DonatorId, CashAssistanceDetailId, PaymentPrice, PaymentGatewayId, PaymentDate, PaymentStatus, SourceAccountNumber, TargetAccountNumber, CharityAccountId, FollowCode, NeedyId, PaymentTime

    const {
        CashAssistanceDetailId,
        PaymentPrice,
        PaymentGatewayId,
        PaymentDate,
        PaymentStatus,
        SourceAccountNumber,
        TargetAccountNumber,
        CharityAccountId,
        FollowCode,
        NeedyId,
        PaymentTime,
        DonatorId,
    } = details;


    // NOTE: CharityAccountId AND TargetAccountNumber is not a required columns anymore. since we dont have online paymentGateway
    // TODO: This if statement is not good(checked on sandbox).
    if (!(("CashAssistanceDetailId" && "PaymentPrice" && "PaymentDate" && "PaymentTime" && "PaymentStatus" && "FollowCode") in details))
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            // Not null Columns
            required: ["CashAssistanceDetailId", "PaymentPrice", "PaymentDate", "PaymentTime", "PaymentStatus", "CharityAccountId", "FollowCode"],
            details
        }

    // Read NeededPrice from cashAssist table
    const {
        ws_loadCashAssistanceDetail
    } = require("./cashAssistanceDetail");
    const cashAssist = await ws_loadCashAssistanceDetail(connection, {
        CashAssistanceDetailId
    }, null, 1);
    // store NeededPrice value in variable called "C"
    const C = cashAssist.recordset[0].NeededPrice;

    // SUM up all successfull payments and store it in a variable called "A"‌
    const A = await sumSuccessfulPayments(connection, paymentStatusMsg.success, " CharityAccountId IS NULL ") || 0;

    // A + newPaymentPrice should not be greater than needed price 
    if (A + Number(PaymentPrice) > C)
        return {
            status: "Failed",
            msg: "total Successfull payments + new payments should not be greater than needed price",
            "total successfull payments": A,
            "needed price": C,
            "new payment": PaymentPrice
        }



    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `INSERT INTO 
    [${DB_DATABASE}].[dbo].[tblPayment] 
    ($COLUMN) 
    VALUES 
    ($VALUE);
    SELECT SCOPE_IDENTITY() as paymentId;`
    // normalizeQS_Create => (queryString, {planName: "sth"}, ...configs)
    queryString = normalizeQueryString_Create(queryString, details);
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        const id = result.recordset[0].paymentId;
        return id;
    } catch (err) {
        console.error("ws_payment error: ", err);
    }
}


async function sumSuccessfulPayments(connection, successMessage, customQuery) {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;

    let queryString = `SELECT SUM(PaymentPrice) as TotalAmount FROM [${DB_DATABASE}].[dbo].[tblPayment] WHERE PaymentStatus = '${successMessage}' `;
    if (customQuery) {
        queryString += ` AND ${customQuery} `;
    }
    try {
        const request = pool.request();
        const result = await request.query(queryString)
        return result.recordset[0].TotalAmount;
    } catch (err) {
        console.error("SQL Error on sumSuccessfulPayments method ", err);
    }
}
// NOTE: This method doesn't support bulk updating
const ws_updatePayment = async (connection, paymentId, newValues = new Object(null)) => {
    // Inputs and params: 
    // DonatorId, CashAssistanceDetailId, PaymentPrice, PaymentGatewayId, PaymentDate, PaymentStatus, SourceAccountNumber, TargetAccountNumber, CharityAccoundId, FollowCode, NeedyId, PaymentTime, PaymentId
    if (!Object.keys(newValues).length)
        return {
            status: "Failed",
            msg: "Error Updating payment, give some newValues"
        }

    const {
        PaymentPrice
    } = newValues;


    const filteredRow = await ws_loadPayment(connection, {
        PaymentId: paymentId
    }, null, 1);
    if (!filteredRow.recordset.length)
        return {
            stauts: "Failed",
            msg: "error updating payment, This paymentID is undefined",
            paymentId
        }
    // NOTE: you can update those that CharityAccountId is not null.
    const charityAccountId = filteredRow.recordset[0].CharityAccountId;
    if (!charityAccountId)
        return {
            status: "Failed",
            msg: `error updating payment, update if charityAccountId is not null`,
            paymentId,
            newValues,
            "table record": filteredRow
        }
    // NOTE: you can update those that TargetAccountNumber has no value.
    const targetAccountNumber = filteredRow.recordset[0].TargetAccountNumber;
    if (targetAccountNumber)
        return {
            status: "Failed",
            msg: "error updating payment, targetAccountNumber must not have any value",
            paymentId,
            newValues,
            "table record": filteredRow
        }

    // NOTE: you can update those that PaymentStatus is not successfull. 
    const paymentStatus = filteredRow.recordset[0].PaymentStatus;
    if (paymentStatus == paymentStatusMsg.success)
        return {
            status: "Failed",
            msg: "error updating payment, paymentStatus is successful",
            paymentId,
            newValues,
            "table record": filteredRow
        }



    // NOTE: put neededPrice (from tblCashAssistanceDetail) into variable called C
    if ("PaymentPrice" in newValues) {
        const {
            ws_loadCashAssistanceDetail
        } = require("./cashAssistanceDetail");
        const cashAssistId = filteredRow.recordset[0].CashAssistanceDetailId;
        const cashAssistRow = await ws_loadCashAssistanceDetail(connection, {
            CashAssistanceDetailId: cashAssistId
        });
        const C = cashAssistRow.recordset[0].NeededPrice;
        // NOTE: CashAssistanceDetailId AND PaymentStatus = "Successful" AND CharityAccountId IS NULL - SUM(PaymentPrice) into "A"
        const A = await sumSuccessfulPayments(connection, paymentStatusMsg.success, " CharityAccountId IS NULL ") || 0;
        // NOTE: CashAssistanceDetailId, PaymentPrice = "Successful" - SUM(PaymentPrice) -> "B"
        const B = await sumSuccessfulPayments(connection, paymentStatusMsg.success, " CharityAccountId IS NOT NULL ") || 0;
        // NOTE: B + newPaymentPrice Should not be bigger than 'C' AND 'A'
        const accumulated = Number(B) + Number(PaymentPrice);

        if (accumulated > Number(C) || accumulated > Number(A))
            return {
                status: "Failed",
                msg: "Error Updating Row, Sucessfull Payments + newPaymentPrice should not be bigger than TotalAmount or NeededPrice",
                "NeededPrice": C,
                "Total Amount of Successful payments (charityId null) ": A,
                "Total Amount of Successful payments": B,
                accumulated
            }
    }
    // NOTE: update table
    let queryString = `UPDATE 
    [${DB_DATABASE}].[dbo].[tblPayment] 
    SET `;
    queryString = setToQueryString(queryString, newValues) + " WHERE 1=1 ";
    queryString = normalizeQueryString(queryString, {
        PaymentId: paymentId
    });

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
        const table = await ws_loadPayment(connection);
        return table
    } catch (err) {
        console.error("ws_updatePayment SQL Error: ", err);
    }
}


const ws_deletePayment = async (connection, paymentId) => {
    // TODO: return table
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `DELETE 
    ${DB_DATABASE}.[dbo].[tblPayment] 
    WHERE PaymentId = ${paymentId};`
    try {
        const request = pool.request();
        const deleteResult = await request.query(queryString)
        const table = await ws_loadPayment(connection);
        return table;
    } catch (err) {
        console.error("ws_deletePayment SQL error: ", err)
    }
}

module.exports = {
    ws_loadPayment,
    ws_payment,
    ws_updatePayment,
    ws_deletePayment
}