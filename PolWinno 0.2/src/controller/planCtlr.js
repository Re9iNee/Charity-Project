const {
    ws_loadPlan,
} = require("../services/plan");

const {
    poolConnect,
    pool
} = require('../utils/charityDb');


exports.getPlans = async (req, res) => {
    let query = req.query;
    // T07 - Method 01
    // path: /plans/?PlanId=1&PlanName=Birthday&PlanNature=true&ParentPlanId=&Fdate=12-20-21&Tdate=12-20-21&neededLogin=false
    const result = await ws_loadPlan({
        pool,
        poolConnect
    }, {
        PlanName: query.PlanName,
        PlanNature: query.PlanNature,
        ParentPlanId: query.ParentPlanId,
        Fdate: query.Fdate,
        Tdate: query.Tdate,
        neededLogin: query.neededLogin,
        PlanId: query.PlanId
    });
    // Deconstrucing req.query object helps prevent typo in request url path. therefore keep our program less error prone.
    res.send({
        result
    })
}