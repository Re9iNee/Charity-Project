const express = require("express");
const planCtlr = require("../controller/planCtlr");


const router = express.Router();

router.get("/plans", planCtlr.getPlans);
router.post("/plans", planCtlr.postPlans);
router.put("/plans", planCtlr.updatePlans);
router.delete("/plans", planCtlr.deletePlans);



module.exports = router;