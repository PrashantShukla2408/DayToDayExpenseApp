const path = require("path");

const express = require("express");

const userControllers = require("../controllers/userControllers");

const router = express();

router.post("/postUser", userControllers.postUser);

module.exports = router;
