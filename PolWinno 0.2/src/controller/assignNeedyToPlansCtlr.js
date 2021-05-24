const {
    ws_loadNeedyForPlan,
    ws_AssignNeedyToPlan,
    ws_deleteNeedyFromPlan
} = require("../services/assignNeedyToPlans");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getAssignNeedyToPlans = async (req, res) => {
 
    try {
        let query = req.query;
        // T08 - Method 01
        // path: /assignNeedyToPlans/?
        const result = await ws_loadNeedyForPlan({
            pool,
            poolConnect
        }, {
            NeedyId: query.NeedyId,
            PlanId: query.PlanId,
            AssignNeedyPlanId: query.AssignNeedyPlanId
        });
        // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
        res.status(200).json({result});

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};



exports.assignNeedyToPlans = async (req, res) => {

    try {
        let values = req.body;

        const result = await ws_AssignNeedyToPlan({
            pool,
            poolConnect
        }, values);

        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });

        } else {
                    
            const assignNeedyToPlans = await ws_loadNeedyForPlan({
                pool,
                poolConnect
            }, {
                AssignNeedyPlanId: result.recordset[0].AssignNeedyPlanId
            });

            res.status(201).json({
                assignNeedyToPlans
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};



exports.deleteNeedyFromPlans = async (req, res) => {

    try {

        let AssignNeedyPlanId = req.params.assignNeedyPlanId;
        console.log(AssignNeedyPlanId);
        const result = await ws_deleteNeedyFromPlan({
            pool,
            poolConnect
        }, AssignNeedyPlanId );

        if(result.status === 'Failed'){
            res.status(422).json({
                result
            });
        } else {
            res.status(200).json({
                result
            });
        }
    } catch (err) {
        console.log(err);
    }
};