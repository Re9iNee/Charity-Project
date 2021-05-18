const express = require("express");
const commonBaseTypeCtlr = require('../controller/commonBaseTypeCtlr');



const router = express.Router();

router.get("/commonBaseType", commonBaseTypeCtlr.getCommonBaseType);
router.post("/commonBaseType", commonBaseTypeCtlr.creatCommonBaseType);
router.put("/commonBaseType", commonBaseTypeCtlr.updateCommonBaseType);
router.delete("/commonBaseType", commonBaseTypeCtlr.deleteCommonBaseType);



module.exports = router;