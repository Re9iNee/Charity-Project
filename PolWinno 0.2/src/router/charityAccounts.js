const express = require("express");
const charityAccountsCtlr = require('../controller/charityAccountsCtlr');



const router = express.Router();

router.get("/charityAccounts" , charityAccountsCtlr.getCharityAccount );
router.post("/charityAccounts" , charityAccountsCtlr.createCharityAccount );
router.put("/charityAccounts/:charityAccountId" , charityAccountsCtlr.updateCharityAccount );
router.delete("/charityAccounts/:charityAccountId" , charityAccountsCtlr.deleteCharityAccount );



module.exports = router;

