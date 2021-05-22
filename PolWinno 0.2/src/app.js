const express = require("express");
const dotEnv = require("dotenv");
const bodyPaser = require('body-parser');
const path = require('path');
const upload = require("./utils/uploadImage");

const commonBaseTypeRoutes = require('./router/commonBaseType');
const commonBaseDataRoutes = require('./router/commonBaseData');
const charityAccountsRoutes = require('./router/charityAccounts');
const personalInfoRoutes = require('./router/personalInfo');
const needyAccountRoutes = require('./router/needyAccount');
const plansRoutes = require('./router/plan');
const cashAssistanceDetailRouter = require("./router/cashAssistanceDetail");
const assignNeedyToPlansRouter = require("./router/assignNeedyToPlans");
const paymentRouter = require("./router/payment");
const settlementRouter = require("./router/settlement");






// config

dotEnv.config({
    path: "./utils/.env"
});
const port = process.env.PORT || 4000;


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


//set header
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
    }
);


app.use(express.json({
    limit: '1mb'
}));


// ---Routes---

/*  TASK 2 */

app.use("/api/" , commonBaseTypeRoutes);


/*  TASK 3 */

app.use("/api/" , commonBaseDataRoutes);


/*  TASK 4 */

app.use("/api/" , charityAccountsRoutes);


/*  TASK 5 */

app.use("/api/" , personalInfoRoutes);


/*  TASK 6 */

app.use("/api/" , needyAccountRoutes);


/*  TASK 7 */

app.use("/api/" , plansRoutes)



/*  TASK 8 */

app.use("/api/" , assignNeedyToPlansRouter);


/*  TASK 9 */

app.use(cashAssistanceDetailRouter)

/*  TASK 10 */

app.use(paymentRouter);

/*  TASK 11 */

app.use(settlementRouter);

//-----------------------------------



/* ----  Testing Area: ----- */
const {
    pool,
    poolConnect
} = require("./utils/charityDb");
(async () => {})();
/* -----  End of Testing Area ---- */

app.listen(port, () => console.log(`Listening on ${port}`));