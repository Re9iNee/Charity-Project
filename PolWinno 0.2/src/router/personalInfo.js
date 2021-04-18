const express = require("express");
const personalCtlr = require('../controller/personalCtlr');



const router = express.Router();

router.get("/personalInfo" , personalCtlr.getPersonalData );
router.post("/personalInfo" , personalCtlr.createPersonalData );
router.put("/personalInfo" , personalCtlr.updatePersonalData );
router.delete("/personalInfo" , personalCtlr.deletePersonalData );



module.exports = router;

