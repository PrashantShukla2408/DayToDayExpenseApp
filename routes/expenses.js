const path = require("path");

const express = require("express");

const expenseControllers = require("../controllers/expenseControllers");

const auth = require("../middleware/auth");

const router = express();

router.post("/addExpense", auth, expenseControllers.postExpense);
router.delete("/deleteExpense/:expenseId", expenseControllers.deleteExpense);
router.get("/getExpenses", auth, expenseControllers.getExpenses);

module.exports = router;
