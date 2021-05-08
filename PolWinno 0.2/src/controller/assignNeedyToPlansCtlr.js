const {
    ws_loadNeedyForPlan,
    ws_AssignNeedyToPlan,
    ws_deleteNeedyFromPlan
} = require("../services/assignNeedyToPlans");
const {
    poolConnect,
    pool
} = require('../utils/charityDb ');



exports.getAssignNeedyToPlans = async (req, res) => {
 
    try {
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
    } catch (err) {
        console.log(err);
    }
};



exports.assignNeedyToPlans = async (req, res) => {

    try {
        let values = req.body;

        const result = await ws_AssignNeedyToPlan({
            pool,
            poolConnect
        }, values);

        res.send({
            result
        });

    } catch (err) {
        console.log(err);
    }
};



exports.deleteNeedyFromPlans = async (req, res) => {

    try {
        const {AssignNeedyPlanId , PlanId} = req.body;

        const result = await ws_deleteNeedyFromPlan({
            pool,
            poolConnect
        }, AssignNeedyPlanId , PlanId);

        res.send({
            result
        });
    } catch (err) {
        console.log(err);
    }
};