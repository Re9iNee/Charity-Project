const express = require("express");
const dotEnv = require("dotenv");
const bodyPaser = require('body-parser');
const path = require('path');

const commonBaseTypeRoutes = require('./router/commonBaseType');
const commonBaseDataRoutes = require('./router/commonBaseData');
const charityAccountsRoutes = require('./router/charityAccounts');
const personalInfoRoutes = require('./router/personalInfo');
const needyAccountRoutes = require('./router/needyAccount');
const plansRoutes = require('./router/plan');
const upload = require("./utils/uploadImage");



// config

dotEnv.config({
    path: "./utils/.env"
});
const port = process.env.PORT || 3000;


// express

const app = express();


// static folder
app.use(express.static(path.join(__dirname, "public")));


//bodyParser

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({
    extended: false
}));

//multer
app.use(upload.any()); 


app.use(express.json({
    limit: '1mb'
}));


// ---Routes---

/*  TASK 2 */

app.use(commonBaseTypeRoutes);


/*  TASK 3 */

app.use(commonBaseDataRoutes);


/*  TASK 4 */

app.use(charityAccountsRoutes);


/*  TASK 5 */

app.use(personalInfoRoutes);


/*  TASK 6 */

app.use(needyAccountRoutes);


/*  TASK 7 */

app.use(plansRoutes)

//-----------------------------------


app.listen(port, () => console.log(`Listening on ${port}`));