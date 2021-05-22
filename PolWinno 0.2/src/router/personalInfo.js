const express = require("express");
const personalCtlr = require('../controller/personalCtlr');



const router = express.Router();

router.get("/personalInfo" , personalCtlr.getPersonalData );
router.post("/personalInfo" , personalCtlr.createPersonalData );
router.put("/personalInfo/:personId" , personalCtlr.updatePersonalData );
router.delete("/personalInfo/:personId" , personalCtlr.deletePersonalData );



module.exports = router;

