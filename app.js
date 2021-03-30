require("dotenv").config();


const sql = require("mssql");
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
}
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
pool.on("error", err => {
    console.log("Could not Connect to the Database", err);
})



const express = require("express");
const app = express();


/*  TASK 2 */ 

// const {
//     ws_loadBaseType,
//     ws_createBaseType
// } = require("./T02-Creating Constant Identifiers/commonBaseMethods");

/* Examples: Task 02. Method 01 */
// ws_loadBaseType({pool, poolConnect}, {BaseTypeCode: 23, BaseTypeTitle: "Asghar", CommonBaseTypeId: 2});
// Usuage: 
// (async () => {
//     const result =await ws_loadBaseType({pool, poolConnect}, {BaseTypeCode: null, BaseTypeTitle: null, CommonBaseTypeId: null});
//     console.dir(result)
// })();





// Exmaple: Task 02. Method 02
// (async () => {
//     const result = await ws_createBaseType({
//         pool,
//         poolConnect
//     }, 'Ame', '14')
//     console.log("Created Row has an Id Of, CommonBaseTypeId: ", result)
// })();
// ws_createBaseType({pool, poolConnect}, 'AsgharDAYI', 4);






// Example: Task 03, Method 01
/*  TASK 3 */
const {
    ws_loadBaseValue,
    ws_createBaseValue
} = require("./T03 - BaseInfo Services - Constant Values Task/constantValues");
(async() => {
        // Method 01
    // const result = await ws_loadBaseValue({
    //     pool,
    //     poolConnect
    // }, {
    //     CommonBaseDataId: 1,
    //     CommonBaseTypeId: '5',
    //     BaseCode: '2',
    //     BaseValue: 'dwad',
    // })
        // Method 02
    // const result = await ws_createBaseValue({
    //     pool,
    //     poolConnect
    // }, '23', '24', '4')
})();