const path = require("path");

const express = require("express");

const auth = require("../middlewares/auth");

const cashfreeControllers = require("../controllers/cashfreeControllers");

const router = express.Router();

router.get("/payment", auth, cashfreeControllers.createOrder);
router.post("/verify", auth, cashfreeControllers.getPaymentStatus);

module.exports = router;
