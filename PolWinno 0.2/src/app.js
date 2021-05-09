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
const assignNeedyToPlansRouter = require("./router/assignNeedyToPlans")
const paymentRouter = require("./router/payment")






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



/*  TASK 8 */

app.use(assignNeedyToPlansRouter);


/*  TASK 9 */

app.use(cashAssistanceDetailRouter)

/*  TASK 10 */

app.use(paymentRouter);

//-----------------------------------



/* ----  Testing Area: ----- */
const {
    pool,
    poolConnect
} = require("./utils/charityDb");
const {
    ws_loadPayment
} = require("./services/payment");
const {
    ws_updateCashAssistanceDetail,
    ws_loadCashAssistanceDetail,
    ws_deleteCashAssistanceDetail
} = require("./services/cashAssistanceDetail");
const { ws_deleteCharityAccounts } = require("./services/charityAccounts");
(async () => {
    // // T09 - Method 02
    // const result = await ws_createCashAssistanceDetail({
    //     pool,
    //     poolConnect
    // }, {
    //     PlanId: 5,
    //     MinPrice: 2000,
    //     NeededPrice: 2000
    // });
    // console.log({
    //     result
    // })
    // T10 - Method 02 - Load
    // const result = await ws_loadPayment({
    //     pool,
    //     poolConnect
    // });
    // console.log({
    //     result
    // })
    // T09 - Method 03
    // const result = await ws_updateCashAssistanceDetail({
    //     pool,
    //     poolConnect
    // }, {
    //     cashAssistanceDetailId: "12"
    // }, {
    //     MinPrice: "3000",
    //     NeededPrice: "3500"
    // });
    // console.log(result);
    // T10 - Method 04
    // const result = await ws_deleteCashAssistanceDetail({
    //     pool,
    //     poolConnect
    // }, "17");
    // console.log(result)
})();




/* -----  End of Testing Area ---- */

app.listen(port, () => console.log(`Listening on ${port}`));