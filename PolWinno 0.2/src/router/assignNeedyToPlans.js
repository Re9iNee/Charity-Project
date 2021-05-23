const express = require("express");
const assignNeedyToPlansCtlr = require('../controller/assignNeedyToPlansCtlr');



const router = express.Router();

router.get("/assignNeedyToPlans", assignNeedyToPlansCtlr.getAssignNeedyToPlans);
router.post("/assignNeedyToPlans", assignNeedyToPlansCtlr.assignNeedyToPlans);
router.delete("/assignNeedyToPlans/:assignNeedyPlanId", assignNeedyToPlansCtlr.deleteNeedyFromPlans);



module.exports = router;