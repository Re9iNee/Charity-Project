/* 
1. Why Using Connection Pool?
 - We don't want to overhead database with so many connections. we open one use it for multiple Queries. then close() connection when we don't need it.
2. Why resultLimit? 
 - It is recommended to use SELECT TOP $(int) instead of Selecting and returning Everything from database.
*/

// Task 02 Method 01
exports.ws_loadBaseType = async (connection ,filters, resultLimit = 1000) => {
    const {pool, poolConnect} = connection;
    // ensures that the pool has been created
    await poolConnect;
    let queryString = `SELECT TOP (${resultLimit}) [CommonBaseTypeId]
    ,[BaseTypeTitle]
    ,[BaseTypeCode] 
    FROM [SabkadV01].[dbo].[tblCommonBaseType]
    WHERE 1=1`
    queryString =  normalizeQueryString(queryString, filters)
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.dir(result)
        return result;
    }
    catch(err) {
        console.error("SQL error: ", err);
    }
}


function normalizeQueryString(queryString, filters){
    for (let property in filters){
        const filterValue = filters[property];
        if (filterValue){
            if (typeof filterValue !== "string")
                queryString += ` AND ${property}=${filterValue}`;
            else 
                queryString += ` AND ${property}='${filterValue}'`;
        }
    }
    return queryString;
}



// Task 02 Method 02
// exports.ws_createBaseType = async () => {
// }