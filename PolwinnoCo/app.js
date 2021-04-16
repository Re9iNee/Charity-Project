const express = require("express");
const dotEnv = require("dotenv");
const bodyPaser = require('body-parser');

const commonBaseTypeCtlr = require('./controller/commonBaseTypeCtlr');
const commonBaseDataCtlr = require('./controller/commonBaseDataCtlr');
const charityAccountsCtlr = require('./controller/charityAccountsCtlr');



// config

dotEnv.config({path : "./utils/config.env"});

const port = process.env.PORT || 3000;


// express

const app = express();


//bodyParser

app.use(bodyPaser.urlencoded({ extended: false }));


app.use(express.json({
    limit: '1mb'
}));



/*  TASK 1 */

app.get("/commonBaseType" , commonBaseTypeCtlr.getCommonBaseType );
app.post("/commonBaseType" , commonBaseTypeCtlr.creatCommonBaseType );
app.put("/commonBaseType" , commonBaseTypeCtlr.updateCommonBaseType );
app.delete("/commonBaseType" , commonBaseTypeCtlr.deleteCommonBaseType );



/*  TASK 2 */

app.get("/commonBaseData" , commonBaseDataCtlr.getCommonBaseData );
app.post("/commonBaseData" , commonBaseDataCtlr.createCommonBaseData );
app.put("/commonBaseData" , commonBaseDataCtlr.updateCommonBaseData );
app.delete("/commonBaseData" , commonBaseDataCtlr.deleteCommonBaseData );
  


/*  TASK 3 */

app.get("/charityAccounts" , charityAccountsCtlr.createCharityAccount );




//-----------------------------------

app.listen(port, () => {
    console.log(`Listening on ${port}`)
});