const express = require("express");
const planCtlr = require("../controller/planCtlr");


const router = express.Router();

router.get("/plans", planCtlr.getPlans);



module.exports = router;