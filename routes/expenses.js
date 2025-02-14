const path = require("path");

const express = require("express");

const expenseControllers = require("../controllers/expenseControllers");

const auth = require("../middlewares/auth");

const router = express();

router.post("/addExpense", auth, expenseControllers.postExpense);
router.delete(
  "/deleteExpense/:expenseId",
  auth,
  expenseControllers.deleteExpense
);
router.get("/getExpenses", auth, expenseControllers.getExpenses);

module.exports = router;
