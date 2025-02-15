const path = require("path");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

exports.postExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.userId;

  try {
    const expense = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      UserId: userId,
    });

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const totalExpense = user.totalExpense + amount;
    await User.update(
      {
        totalExpense: totalExpense,
      },
      {
        where: { id: userId },
      }
    );

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error saving expense: ", err });
  }
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.expenseId;
  const userId = req.userId;

  try {
    const expense = await Expense.findOne({
      where: { expenseId: expenseId, UserId: userId },
    });
    if (expense) {
      await expense.destroy();
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (err) {
    console.log("Error deleting expense");
    res.status(500).json({ message: "Error deleting expense:", err });
  }
};

exports.getExpenses = (req, res) => {
  const userId = req.userId;
  Expense.findAll({ where: { userId } })
    .then((expenses) => {
      console.log(expenses);
      res.status(200).json(expenses);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching expenses", err });
    });
};
