const express = require("express");
const paymentCtlr = require("../controller/paymentCtlr");


const router = express.Router();

router.get("/payment", paymentCtlr.getPayment);
router.post("/payment", paymentCtlr.makePayment);
router.put("/payment", paymentCtlr.updatePayment);
router.delete("/payment", paymentCtlr.deletePayment);



module.exports = router;