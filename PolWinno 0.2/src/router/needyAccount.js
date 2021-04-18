const express = require("express");
const needyCtlr = require('../controller/needyCtlr');



const router = express.Router();

router.get("/needyAccount" , needyCtlr.getNeedyAccount );
router.post("/needyAccount" , needyCtlr.createNeedyAccount );
router.put("/needyAccount" ,  needyCtlr.updateNeedyAccount );
router.delete("/needyAccount" ,  needyCtlr.deleteNeedyAccount );



module.exports = router;

