const path = require("path");

const express = require("express");

const reportControllers = require("../controllers/reportControllers");

const auth = require("../middlewares/auth");

const router = express();

router.get("/getDailyData", auth, reportControllers.getDailyData);
router.get("/getWeeklyData", auth, reportControllers.getWeeklyData);
router.get("/getMonthlyData", auth, reportControllers.getMonthlyData);

module.exports = router;
