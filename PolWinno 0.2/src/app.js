const express = require("express");
const dotEnv = require("dotenv");
const bodyPaser = require('body-parser');

const commonBaseTypeRoutes = require('./router/commonBaseType');
const commonBaseDataRoutes = require('./router/commonBaseData');
const charityAccountsRoutes = require('./router/charityAccounts');
const personalInfoRoutes = require('./router/personalInfo');
const needyAccountRoutes = require('./router/needyAccount');



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


// ---Routes---

/*  TASK 1 */

    app.use(commonBaseTypeRoutes);


/*  TASK 2 */

    app.use(commonBaseDataRoutes);


/*  TASK 3 */

    app.use(charityAccountsRoutes);


/*  TASK 4 */

    app.use(personalInfoRoutes);


/*  TASK 5 */

    app.use(needyAccountRoutes);


//-----------------------------------


app.listen(port, () => console.log(`Listening on ${port}`) );