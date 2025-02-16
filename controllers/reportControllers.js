const path = require("path");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const { Op } = require("sequelize");

exports.getDailyData = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyData = await Expense.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });
    res.status(200).json(dailyData);
  } catch (error) {
    console.log("Error fetching daily data:", error);
    res.status(500).json({ message: "Error fetching daily data" });
  }
};

exports.getWeeklyData = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeklyData = await Expense.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gte]: today.setDate(today.getDate() - 7),
        },
      },
    });
    res.status(200).json(weeklyData);
  } catch (error) {
    console.log("Error fetching weekly data:", error);
    res.status(500).json({ message: "Error fetching weekly data" });
  }
};

exports.getMonthlyData = async (req, res) => {
  try {
    const userId = req.userId;
    const currentMonth = new Date().getMonth();

    const monthlyData = await Expense.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(currentMonth - 1)),
        },
      },
    });
    res.status(200).json(monthlyData);
  } catch (error) {
    console.log("Error fetching monthly data:", error);
    res.status(500).json({ message: "Error fetching monthly data" });
  }
};
