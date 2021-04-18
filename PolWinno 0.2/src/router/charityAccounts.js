const express = require("express");
const charityAccountsCtlr = require('../controller/charityAccountsCtlr');



const router = express.Router();

router.get("/charityAccounts" , charityAccountsCtlr.getCharityAccount );
router.post("/charityAccounts" , charityAccountsCtlr.createCharityAccount );
router.put("/charityAccounts" , charityAccountsCtlr.updateCharityAccount );
router.delete("/charityAccounts" , charityAccountsCtlr.deleteCharityAccount );



module.exports = router;

