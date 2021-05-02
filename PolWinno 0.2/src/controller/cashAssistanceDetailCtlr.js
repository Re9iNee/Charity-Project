const {
    ws_loadCashAssistanceDetail,
} = require("../services/cashAssistanceDetail");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getCashAssistanceDetail = async (req, res) => {
    let query = req.query;
    // T09 - Method 01
    // path = /cashAssistanceDetail/?AssignNeedyPlanId=1&PlanId=1&CashAssistanceDetailId=1
    const result = await ws_loadCashAssistanceDetail({
        pool,
        poolConnect
    }, {
        AssignNeedyPlanId: query.AssignNeedyPlanId,
        PlanId: query.PlanId,
        CashAssistanceDetailId: query.CashAssistanceDetailId
    });
    // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
    res.send({
        result
    })
}