const express = require("express");
const paymentCtlr = require("../controller/paymentCtlr");


const router = express.Router();

router.get("/payment", paymentCtlr.getPayment);
router.post("/payment", paymentCtlr.makePayment);



module.exports = router;