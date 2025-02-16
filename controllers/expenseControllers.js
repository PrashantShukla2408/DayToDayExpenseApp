const path = require("path");

const sequelize = require("../util/database");
const { Op } = require("../util/database");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

exports.postExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { amount, description, category } = req.body;
  const userId = req.userId;

  try {
    const expense = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        UserId: userId,
      },
      { transaction: t }
    );

    const user = await User.findByPk(userId);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }
    const totalExpense = Number(user.totalExpense) + Number(amount);
    await User.update(
      {
        totalExpense: totalExpense,
      },
      {
        where: { id: userId },
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json(expense);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Error saving expense: ", err });
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const expenseId = req.params.expenseId;
  const userId = req.userId;

  try {
    const expense = await Expense.findOne({
      where: { expenseId: expenseId, UserId: userId },
    });
    if (expense) {
      const user = await User.findByPk(userId);
      const totalExpense = Number(user.totalExpense) - Number(expense.amount);
      await User.update(
        {
          totalExpense: totalExpense,
        },
        {
          where: { id: userId },
          transaction: t,
        }
      );
      await t.commit();
      await expense.destroy();
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      await t.rollback();
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (err) {
    console.log("Error deleting expense");
    res.status(500).json({ message: "Error deleting expense:", err });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where: {
        UserId: userId,
      },
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res
      .status(200)
      .json({ items: rows, totalPages: totalPages, currentPage: page });
  } catch (error) {
    console.log("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};
