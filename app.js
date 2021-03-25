const sql = require("mssql");
const config = {
    user: "sa",
    password: "Rainbow78951",
    server: "localhost",
    database: "SabkadV01",
}
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
pool.on("error", err => {
    console.log("Could not Connect to the Database", err);
})
const {
    ws_loadBaseType,
    ws_createBaseType
} = require("./T02-Creating Constant Identifiers/commonBaseMethods");


/* Examples: Task 02. Method 01 */
// ws_loadBaseType({pool, poolConnect}, {BaseTypeCode: 23, BaseTypeTitle: "Asghar", CommonBaseTypeId: 2});
// Usuage: 
// (async () => {
//     const result =await ws_loadBaseType({pool, poolConnect}, {BaseTypeCode: null, BaseTypeTitle: null, CommonBaseTypeId: null});
//     console.dir(result)
// })();





// Exmaple: Task 02. Method 02
(async () => {
    const result = await ws_createBaseType({
        pool,
        poolConnect
    }, 'Ame', '14')
    console.log("Created Row has an Id Of, CommonBaseTypeId: ", result)
})();
// ws_createBaseType({pool, poolConnect}, 'AsgharDAYI', 4);