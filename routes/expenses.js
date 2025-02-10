const path = require("path");

const express = require("express");

const expenseControllers = require("../controllers/expenseControllers");

const router = express();

router.post("/addExpense", expenseControllers.postExpense);
router.delete("/deleteExpense/:expenseId", expenseControllers.deleteExpense);
router.get("/getExpenses", expenseControllers.getExpenses);

module.exports = router;
