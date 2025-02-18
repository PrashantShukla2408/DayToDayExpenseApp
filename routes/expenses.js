const path = require("path");

const express = require("express");

const expenseControllers = require("../controllers/expenseControllers");

const auth = require("../middlewares/auth");

const router = express();

router.post("/addExpense", auth, expenseControllers.postExpense);
router.delete("/deleteExpense/:id", auth, expenseControllers.deleteExpense);
router.get("/getExpense/:id", auth, expenseControllers.getExpense);
router.put("/editExpense/:id", auth, expenseControllers.editExpense);
router.get("/getExpenses", auth, expenseControllers.getExpenses);

module.exports = router;
