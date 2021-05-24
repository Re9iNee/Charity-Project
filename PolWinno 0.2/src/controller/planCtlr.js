const {
    ws_loadPlan,
    ws_createPlan,
    ws_updatePlan,
    ws_deletePlan,
} = require("../services/plan");

const {
    poolConnect,
    pool
} = require('../utils/charityDb');


exports.getPlans = async (req, res) => {
   
    try {
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
        res.status(200).json({result});

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}


exports.postPlans = async (req, res) => {

    try {
        // T07 - Method 02
        // Attach params to body as an JSON format - Postman Request: 
        const result = await ws_createPlan({
            pool,
            poolConnect
        }, req.body);
        // sending req.body directly causing program more error prone base on a typo, we will deconstruct object in that method.
        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });

        } else {
                    
            let plan = await ws_loadPlan({
                pool,
                poolConnect
            }, {
                PlanId: result
            });

            res.status(201).json({
                plan
            });
        }


    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}


exports.updatePlans = async (req, res) => {
    try {
        // T04 - Method 03
    // Attach filters object and newValues to request body
    // parameters: sql connection, filters, newValues
    // returns charityAccounts Table
    let filters = req.params.planId
    let newValues = req.body;

    const result = await ws_updatePlan({
        pool,
        poolConnect
    },{PlanId:filters} , newValues);

    if(result.status === 'Failed'){

        res.status(422).json({
            result
        });

    } else {
                
        const plan = await ws_loadPlan({
            pool,
            poolConnect
        }, {
            PlanId: result.recordset[0].PlanId
        });

        res.status(200).json({
            plan
        });
    }

    
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};


exports.deletePlans = async (req, res) => {
  
    try {
         // T07 - Method 04
        // parameters: sql connection, planId
        let id = req.params.planId;
        const result = await ws_deletePlan({
            pool,
            poolConnect
        }, id);
        
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
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}