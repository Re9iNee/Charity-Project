const {
    ws_loadPayment,
    ws_payment,
    ws_updatePayment,
    ws_deletePayment
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
        CashAssistanceDetailId: query.CashAssistanceDetailid,
        PaymentGatewayId: query.PaymentGatewayId,
        PaymentDate: query.PaymentDate,
        PaymentStatus: query.PaymentStatus,
        CharityAccountId: query.CharityAccountId,
        FollowCode: query.FollowCode,
        NeedyId: query.NeedyId,
        PaymentId: query.PaymentId
    });
    // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
    res.send({
        result
    })
}


exports.makePayment = async (req, res) => {
    // T10 - Method 01
    // Attach params to body as an JSON
    const result = await ws_payment({
        pool,
        poolConnect
    }, req.body);
    // sending req.body directly causing program more error prone since there might be a typo, we will deconstruct object in that method.
    res.send({
        result
    });
}


exports.updatePayment = async (req, res) => {
    // T11 - ws_updatePayment
    // Attach paymentId and newValues to request.body
    // parameters sql connection, paymentId, newValues
    const result = await ws_updatePayment({
        pool,
        poolConnect
    }, req.body.paymentId, req.body.newValues);
    res.send({
        result
    })
}


exports.deletePayment = async (req, res) => {
    // T11 - ws_deletePayment
    // parameters: sql connection, paymentId
    const result = await ws_deletePayment({
        pool,
        poolConnect
    }, req.body.paymentId);
    res.send({
        result
    });
}