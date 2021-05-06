const express = require("express");
const cashAssistanceCtlr = require('../controller/cashAssistanceDetailCtlr.js');



const router = express.Router();

router.get("/cashAssistanceDetail", cashAssistanceCtlr.getCashAssistanceDetail);
router.post("/cashAssistanceDetail", cashAssistanceCtlr.postCashAssistanceDetail);
router.put("/cashAssistanceDetail", cashAssistanceCtlr.updateCashAssistanceDetail);



module.exports = router;