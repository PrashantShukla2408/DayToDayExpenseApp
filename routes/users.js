const path = require("path");

const express = require("express");

const userControllers = require("../controllers/userControllers");

const auth = require("../middlewares/auth");

const router = express();

router.post("/postUser", userControllers.postUser);
router.post("/login", userControllers.postLogin);
router.get("/userStatus", auth, userControllers.getUserStatus);

module.exports = router;
