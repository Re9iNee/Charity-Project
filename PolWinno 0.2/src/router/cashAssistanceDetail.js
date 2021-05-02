const express = require("express");
const cashAssistanceCtlr = require('../controller/cashAssistanceDetailCtlr.js');



const router = express.Router();

router.get("/cashAssistanceDetail", cashAssistanceCtlr.getCashAssistanceDetail);



module.exports = router;