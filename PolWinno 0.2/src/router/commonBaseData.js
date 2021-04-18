const express = require("express");
const commonBaseDataCtlr = require('../controller/commonBaseDataCtlr');



const router = express.Router();

router.get("/commonBaseData" , commonBaseDataCtlr.getCommonBaseData );
router.post("/commonBaseData" , commonBaseDataCtlr.createCommonBaseData );
router.put("/commonBaseData" , commonBaseDataCtlr.updateCommonBaseData );
router.delete("/commonBaseData" , commonBaseDataCtlr.deleteCommonBaseData );
 

module.exports = router;

