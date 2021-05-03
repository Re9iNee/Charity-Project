const {
    ws_loadNeedyForPlan,
} = require("../services/assignNeedyToPlans");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getAssignNeedyToPlans = async (req, res) => {
    let query = req.query;
    // T08 - Method 01
    // path: /assignNeedyToPlans/?
    const result = await ws_loadNeedyForPlan({
        pool,
        poolConnect
    }, {
        NeedyId: query.needyId,
        PlanId: query.planId,
        AssignNeedyPlanId: query.AssignNeedyPlanId
    });
    // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
    res.send({
        result
    })
}