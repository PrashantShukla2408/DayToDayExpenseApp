const path = require("path");
const express = require("express");

const userControllers = require("../controllers/userControllers");

const router = express();

router.get("/leaderboard", userControllers.getLeaderboard);

module.exports = router;
