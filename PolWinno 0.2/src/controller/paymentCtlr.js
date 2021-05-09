const {
    ws_loadPayment,
} = require("../services/payment");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getPayment = async (req, res) => {
    let query = req.query;
    // T10 - Method 02
    // path: /payment?cashAssistanceDetailid=&paymentGatewayId=&paymentDate=&paymentStatus&charityAccountId&followCode&needyId&paymentId
    const result = await ws_loadPayment({
        pool,
        poolConnect
    }, {
        CashAssistanceDetailId: query.cashAssistanceDetailid,
        PaymentGatewayId: query.paymentGatewayId,
        PaymentDate: query.paymentDate,
        PaymentStatus: query.paymentStatus,
        CharityAccountId: query.harityAccountId,
        FollowCode: query.followCode,
        NeedyId: query.needyId,
        PaymentId: query.paymentId
    });
    // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
    res.send({
        result
    })
}