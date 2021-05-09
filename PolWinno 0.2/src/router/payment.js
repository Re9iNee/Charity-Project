const express = require("express");
const paymentCtlr = require("../controller/paymentCtlr");


const router = express.Router();

router.get("/payment", paymentCtlr.getPayment);



module.exports = router;