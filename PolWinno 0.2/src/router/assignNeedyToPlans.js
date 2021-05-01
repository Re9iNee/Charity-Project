const express = require("express");
const assignNeedyToPlansCtlr = require('../controller/assignNeedyToPlansCtlr');



const router = express.Router();

router.get("/assignNeedyToPlans" , assignNeedyToPlansCtlr.getAssignNeedyToPlans );



module.exports = router;