const express = require("express");
const settlementCtrl = require('../controller/settlementCtrl');



const router = express.Router();

router.post("/settlement" , settlementCtrl.createSettlement );


module.exports = router;