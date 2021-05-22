const express = require("express");
const planCtlr = require("../controller/planCtlr");


const router = express.Router();

router.get("/plans", planCtlr.getPlans);
router.post("/plans", planCtlr.postPlans);
router.put("/plans/:planId", planCtlr.updatePlans);
router.delete("/plans/:planId", planCtlr.deletePlans);



module.exports = router;