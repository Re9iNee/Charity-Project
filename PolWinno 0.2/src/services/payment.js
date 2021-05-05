const {
    normalizeQueryString
} = require("../utils/commonModules");

require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env;

const ws_loadPayment = async (connection, filters = new Object(null), customQuery = null, resultLimit = 1000) => {
    // in older version of this code. filters object hadn't any default value - Issue #42
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

module.exports = {
    ws_loadPayment,
}