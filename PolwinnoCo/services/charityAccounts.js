const {
    normalizeQueryString,   
} = require("../utils/commonModules");



const ws_loadCharityAccounts = async (connection, filters, customQuery = null, resultLimit = 1000) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [CharityAccountId]
    ,[BankID]
    ,[BranchName]
    ,[OwnerName]
    ,[CardNumber]
    ,[AccountNumber]
    ,[AccountName]
    ,[BaseTypeCode]
    ,[BaseTypeTitle]
    ,[BaseCode]
    ,[BaseValue]
    ,[CommonBaseDataId]
    FROM [SabkadV01].[dbo].[tblCharityAccounts] as charityAcc 
        INNER JOIN [SabkadV01].[dbo].[tblCommonBaseData] as cmData
            on charityAcc.BankID = cmData.CommonBaseDataId
        INNER JOIN [SabkadV01].[dbo].[tblCommonBaseType] as cmType
            on cmData.CommonBaseTypeId = cmType.CommonBaseTypeId
    WHERE 1 = 1 `;
    queryString = normalizeQueryString(queryString, filters);
    if (customQuery)
        queryString += ` ${customQuery}`;
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result);
        return result;
    } catch(err) {
        console.error("SQL error: ", err);
    }
};



module.exports = {
    ws_loadCharityAccounts,
}