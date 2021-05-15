
require("dotenv").config({
    path: "../utils/.env"
});
const {DB_DATABASE} = process.env;

const {ws_loadCashAssistanceDetail} = require("./cashAssistanceDetail");




const sumSuccessfulPayments = async (pool , poolConnect , successMessage , customQuery ) => {

    await poolConnect;


     let queryString = `SELECT SUM(PaymentPrice) as TotalAmount FROM [${DB_DATABASE}].[dbo].[tblPayment] WHERE PaymentStatus = '${successMessage}' AND ${customQuery} `;
    
     console.log(queryString);
     try {
        const request = pool.request();
        const result = await request.query(queryString);
        console.log(result);
        return result.recordset[0].TotalAmount;
    } catch (err) {
        console.error("SQL Error on sumSuccessfulCashAssistance method ", err);
    }
};



const ws_Settelment = async (connection , values ) => {

    
    const {
        pool,
        poolConnect
    } = connection;
    await poolConnect;

    
    const paymentStaus = {
        success: "Successful",
        fail: "Failed"
    };
    

    const {
        CashAssistanceDetailId,
        PaymentPrice,
        PaymentDate,
        PaymentStatus,
        SourceAccountNumber,
        TargetAccountNumber,
        CharityAccountId,
        FollowCode,
        NeedyId,
        PaymentTime,
    } = values;


    // these values are required
    if (!(("CashAssistanceDetailId" && "PaymentPrice" && "PaymentDate" && "PaymentTime" && "PaymentStatus" && "FollowCode") in values))
        return {
            status: "Failed",
            msg: "Fill Parameters Utterly",
            required: ["CashAssistanceDetailId", "PaymentPrice", "PaymentDate", "PaymentTime", "PaymentStatus", "FollowCode"],
            values
        }

    

    // get NeededPrice from CashAssistance table and store it in a variable called "C"
    const cashAssistance = await ws_loadCashAssistanceDetail(connection, {CashAssistanceDetailId} , null, 1);

    const C = cashAssistance.recordset[0].NeededPrice;
    console.log("C:" , C);
   

    // SUM up all successfull payments and store it in a variable called "A"‌
    const A = await sumSuccessfulPayments(pool , poolConnect, paymentStaus.success ,  " CharityAccountId IS NULL ");
    console.log("A:" , A);
 

    // SUM up all successfull CashAssistance and store it in a variable called "B"‌
    const B = await sumSuccessfulPayments(pool , poolConnect, paymentStaus.success ,  " CharityAccountId IS NOT NULL ");
    console.log("B:" , B);

    

    if ( (B + Number(PaymentPrice) > C) && (B + Number(PaymentPrice) > A) ){
        return {
            status: "Failed",
            msg: "total succesfull payments plus new payments should not be greater than needed price and also the total price",
        }
    }


    //CharityAccountId could be null
    if(typeof(CharityAccountId) === 'undefined'){

        
        let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblPayment]
        (CashAssistanceDetailId,PaymentPrice,PaymentDate,PaymentStatus,SourceAccountNumber,TargetAccountNumber,FollowCode,NeedyId,PaymentTime)
        VALUES 
        ('${CashAssistanceDetailId}','${PaymentPrice}','${PaymentDate}','${PaymentStatus}','${SourceAccountNumber}','${TargetAccountNumber}','${FollowCode}','${NeedyId}','${PaymentTime}'); 
        SELECT SCOPE_IDENTITY() AS PaymentId;`

        try {
            const request = pool.request();
            const result = await request.query(queryString);
            console.dir(result);
            return result;
    
        } catch (err) {
            console.error("ws_settlement error: ", err);
        }

    } else{

        let queryString = `INSERT INTO 
        [${DB_DATABASE}].[dbo].[tblPayment]
        (CashAssistanceDetailId,PaymentPrice,PaymentDate,PaymentStatus,SourceAccountNumber,TargetAccountNumber,CharityAccountId,FollowCode,NeedyId,PaymentTime)
        VALUES 
        ('${CashAssistanceDetailId}','${PaymentPrice}','${PaymentDate}','${PaymentStatus}','${SourceAccountNumber}','${TargetAccountNumber}','${CharityAccountId}','${FollowCode}','${NeedyId}','${PaymentTime}'); 
        SELECT SCOPE_IDENTITY() AS PaymentId;`

        try {
            const request = pool.request();
            const result = await request.query(queryString);
            console.dir(result);
            return result;
    
        } catch (err) {
            console.error("ws_settlement error: ", err);
        }

    }

  
};



module.exports = {ws_Settelment};

