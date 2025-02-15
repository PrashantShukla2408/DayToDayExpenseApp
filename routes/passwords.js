const path = require("path");

const express = require("express");

const userControllers = require("../controllers/userControllers");

const auth = require("../middlewares/auth");

const router = express();

router.post("/forgotPassword", auth, userControllers.forgotPassword);
router.post("/resetPassword/:resetToken", userControllers.resetPassword);

module.exports = router;
